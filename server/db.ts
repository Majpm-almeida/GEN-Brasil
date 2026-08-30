import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  analyticalWorksheets,
  deliverables,
  exerciseSettings,
  groupMembers,
  integratedSyntheses,
  type GroupRole,
  type InsertUser,
  users,
  workGroups,
} from "../drizzle/schema";
import { deliverableDefinitions, missions, type Classification, type WorksheetLens } from "../shared/exercise";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function databaseOrThrow() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId || user.email?.trim().toLowerCase() === ENV.managerEmail.trim().toLowerCase()) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}

export async function getMembershipsForUser(userId: number) {
  const db = await databaseOrThrow();
  return db.select({
    membershipId: groupMembers.id,
    groupId: workGroups.id,
    code: workGroups.code,
    missionAxis: workGroups.missionAxis,
    missionText: workGroups.missionText,
    presentationSlot: workGroups.presentationSlot,
    role: groupMembers.role,
    course: groupMembers.course,
  }).from(groupMembers).innerJoin(workGroups, eq(groupMembers.groupId, workGroups.id))
    .where(and(eq(groupMembers.userId, userId), eq(groupMembers.active, true), eq(workGroups.active, true)));
}

export async function listWorkGroups() {
  const db = await databaseOrThrow();
  return db.select().from(workGroups).orderBy(workGroups.code);
}

export async function getAdminDeliveryOverview() {
  const db = await databaseOrThrow();
  const [groups, memberships, groupDeliverables] = await Promise.all([
    listWorkGroups(),
    db.select({ groupId: groupMembers.groupId }).from(groupMembers).where(eq(groupMembers.active, true)),
    db.select({ groupId: deliverables.groupId, status: deliverables.status }).from(deliverables),
  ]);
  return groups.map(group => {
    const deliveries = groupDeliverables.filter(item => item.groupId === group.id);
    return {
      ...group,
      participantCount: memberships.filter(item => item.groupId === group.id).length,
      deliverableCount: deliveries.length,
      draftCount: deliveries.filter(item => item.status === "rascunho").length,
      finalCount: deliveries.filter(item => item.status === "versao_final").length,
      submittedCount: deliveries.filter(item => item.status === "submetido").length,
    };
  });
}

export async function getGroupWorkspace(groupId: number) {
  const db = await databaseOrThrow();
  const [group] = await db.select().from(workGroups).where(eq(workGroups.id, groupId)).limit(1);
  if (!group) return undefined;
  const [members, worksheets, synthesis, groupDeliverables] = await Promise.all([
    db.select({ id: groupMembers.id, userId: users.id, name: users.name, email: users.email, role: groupMembers.role, course: groupMembers.course, active: groupMembers.active })
      .from(groupMembers).innerJoin(users, eq(groupMembers.userId, users.id)).where(eq(groupMembers.groupId, groupId)),
    db.select().from(analyticalWorksheets).where(eq(analyticalWorksheets.groupId, groupId)),
    db.select().from(integratedSyntheses).where(eq(integratedSyntheses.groupId, groupId)).limit(1),
    db.select().from(deliverables).where(eq(deliverables.groupId, groupId)),
  ]);
  return { group, members, worksheets, synthesis: synthesis[0] ?? null, deliverables: groupDeliverables };
}

export async function createWorkGroup(input: { code: string; missionAxis: string; missionText: string; presentationSlot?: string | null }) {
  const db = await databaseOrThrow();
  const result = await db.insert(workGroups).values({ ...input, presentationSlot: input.presentationSlot ?? null });
  const groupId = Number(result[0].insertId);
  await ensureDeliverables(groupId);
  return groupId;
}

export async function ensureDeliverables(groupId: number) {
  const db = await databaseOrThrow();
  for (const deliverable of deliverableDefinitions) {
    await db.insert(deliverables).values({ groupId, type: deliverable.type }).onDuplicateKeyUpdate({ set: { groupId } });
  }
}

export async function initializeOfficialWorkGroups() {
  const db = await databaseOrThrow();
  const slots: Record<number, string> = {
    1: "3 set. · 12:40", 2: "3 set. · 13:00", 3: "3 set. · 13:35", 4: "3 set. · 13:55",
    5: "3 set. · 14:30", 6: "3 set. · 14:50", 7: "3 set. · 15:25", 8: "3 set. · 15:45",
    9: "4 set. · 08:00", 10: "4 set. · 08:20", 11: "4 set. · 08:55", 12: "4 set. · 09:15",
    13: "4 set. · 09:50", 14: "4 set. · 10:10", 15: "4 set. · 10:45", 16: "4 set. · 11:05",
  };
  for (const mission of missions) {
    await db.insert(workGroups).values({
      code: mission.code,
      missionAxis: mission.axis,
      missionText: mission.text,
      presentationSlot: slots[mission.number] ?? null,
      active: true,
    }).onDuplicateKeyUpdate({
      set: { missionAxis: mission.axis, missionText: mission.text, presentationSlot: slots[mission.number] ?? null, active: true },
    });
  }
  const groups = await listWorkGroups();
  await Promise.all(groups.map(group => ensureDeliverables(group.id)));
  return groups;
}

export async function listParticipants() {
  const db = await databaseOrThrow();
  const [participants, memberships] = await Promise.all([
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn)),
    db.select({ userId: groupMembers.userId, groupId: groupMembers.groupId, groupCode: workGroups.code, role: groupMembers.role, course: groupMembers.course })
      .from(groupMembers).innerJoin(workGroups, eq(groupMembers.groupId, workGroups.id)).where(eq(groupMembers.active, true)),
  ]);
  return participants.map(participant => ({ ...participant, memberships: memberships.filter(membership => membership.userId === participant.id) }));
}

export async function assignParticipant(input: { groupId: number; userId: number; role: GroupRole; course?: string | null }) {
  const db = await databaseOrThrow();
  await db.insert(groupMembers).values({ ...input, course: input.course ?? null, active: true })
    .onDuplicateKeyUpdate({ set: { role: input.role, course: input.course ?? null, active: true } });
}

export async function removeParticipantFromGroup(input: { groupId: number; userId: number }) {
  const db = await databaseOrThrow();
  await db.update(groupMembers).set({ active: false }).where(and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, input.userId)));
}

export type WorksheetSaveInput = {
  lens: WorksheetLens;
  classification?: Classification | null;
  selectedEventIds?: string | null;
  testEntries?: string | null;
  includeAsAppendix?: boolean;
  centralJudgment?: string | null;
  evidenceBasis?: string | null;
  limitsAndAlternatives?: string | null;
  clarificationNeeded?: string | null;
  integrationInput?: string | null;
  status: "rascunho" | "versao_final";
};

export async function saveWorksheet(groupId: number, userId: number, input: WorksheetSaveInput) {
  const db = await databaseOrThrow();
  const finalizedAt = input.status === "versao_final" ? new Date() : null;
  const values = { groupId, updatedByUserId: userId, finalizedAt, ...input };
  await db.insert(analyticalWorksheets).values(values).onDuplicateKeyUpdate({
    set: { ...input, updatedByUserId: userId, finalizedAt },
  });
}

export async function setWorksheetAppendix(groupId: number, userId: number, lens: WorksheetLens, includeAsAppendix: boolean) {
  const db = await databaseOrThrow();
  await db.insert(analyticalWorksheets).values({ groupId, lens, includeAsAppendix, updatedByUserId: userId })
    .onDuplicateKeyUpdate({ set: { includeAsAppendix, updatedByUserId: userId } });
}

export type SynthesisSaveInput = {
  selectedEventIds?: string | null;
  connectionNotes?: string | null;
  includeMatrixAsAppendix?: boolean;
  strategicJudgment?: string | null;
  lensResults?: string | null;
  connectionsAndLimits?: string | null;
  missionResponse?: string | null;
  recommendations?: string | null;
  desiredEndState?: string | null;
  slideOne?: string | null;
  slideTwo?: string | null;
  slideThree?: string | null;
  slideFour?: string | null;
  status: "rascunho" | "versao_final";
};

export async function saveIntegratedSynthesis(groupId: number, userId: number, input: SynthesisSaveInput) {
  const db = await databaseOrThrow();
  const finalizedAt = input.status === "versao_final" ? new Date() : null;
  const values = { groupId, updatedByUserId: userId, finalizedAt, ...input };
  await db.insert(integratedSyntheses).values(values).onDuplicateKeyUpdate({
    set: { ...input, updatedByUserId: userId, finalizedAt },
  });
}

export async function setIntegrationMatrixAppendix(groupId: number, userId: number, includeMatrixAsAppendix: boolean) {
  const db = await databaseOrThrow();
  await db.insert(integratedSyntheses).values({ groupId, includeMatrixAsAppendix, updatedByUserId: userId })
    .onDuplicateKeyUpdate({ set: { includeMatrixAsAppendix, updatedByUserId: userId } });
}

export async function setDeliverableStatus(input: {
  groupId: number;
  type: "ficha_guerra_hibrida" | "ficha_lawfare" | "ficha_seguranca_transnacional" | "sintese_integrada" | "slides_finais";
  status: "pendente" | "rascunho" | "versao_final" | "submetido";
  checklistConfirmed: boolean;
  userId: number;
}) {
  const db = await databaseOrThrow();
  const submittedAt = input.status === "submetido" ? new Date() : null;
  await db.insert(deliverables).values({ ...input, updatedByUserId: input.userId, submittedAt }).onDuplicateKeyUpdate({
    set: { status: input.status, checklistConfirmed: input.checklistConfirmed, updatedByUserId: input.userId, submittedAt },
  });
}

export async function getExerciseSettings() {
  const db = await databaseOrThrow();
  const result = await db.select().from(exerciseSettings).limit(1);
  return result[0] ?? null;
}

export async function saveExerciseSettings(input: { coordinationNote?: string | null; finalSubmissionInstructions?: string | null; exerciseOpen: boolean; userId: number }) {
  const db = await databaseOrThrow();
  const existing = await getExerciseSettings();
  if (!existing) {
    await db.insert(exerciseSettings).values({
      coordinationNote: input.coordinationNote ?? null,
      finalSubmissionInstructions: input.finalSubmissionInstructions ?? null,
      exerciseOpen: input.exerciseOpen,
      updatedByUserId: input.userId,
    });
    return;
  }
  await db.update(exerciseSettings).set({
    coordinationNote: input.coordinationNote ?? null,
    finalSubmissionInstructions: input.finalSubmissionInstructions ?? null,
    exerciseOpen: input.exerciseOpen,
    updatedByUserId: input.userId,
  }).where(eq(exerciseSettings.id, existing.id));
}
