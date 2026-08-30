import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "../db";
import { classificationOptions, worksheetLenses } from "../../shared/exercise";
import { canRegisterSubmission, isSynthesisComplete, isWorksheetComplete } from "../../shared/validation";
import { approvedProcedure, router } from "../_core/trpc";

const groupRoleSchema = z.enum(["dirigente", "relator", "integrante"]);
const worksheetStatusSchema = z.enum(["rascunho", "versao_final"]);
const deliverableStatusSchema = z.enum(["pendente", "rascunho", "versao_final", "submetido"]);
const deliverableTypeSchema = z.enum(["ficha_guerra_hibrida", "ficha_lawfare", "ficha_seguranca_transnacional", "sintese_integrada", "slides_finais"]);

async function assertGroupAccess(user: { id: number; role: "user" | "admin" }, groupId: number) {
  if (user.role === "admin") return { canFinalize: true, groupRole: "admin" as const };
  const memberships = await db.getMembershipsForUser(user.id);
  const membership = memberships.find(item => item.groupId === groupId);
  if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Você não possui acesso a este Grupo de Trabalho." });
  return { canFinalize: membership.role === "dirigente" || membership.role === "relator", groupRole: membership.role };
}

export const workspaceRouter = router({
  myAccess: approvedProcedure.query(async ({ ctx }) => {
    const memberships = await db.getMembershipsForUser(ctx.user.id);
    const availableGroups = ctx.user.role === "admin" ? await db.listWorkGroups() : [];
    return { isAdmin: ctx.user.role === "admin", memberships, availableGroups };
  }),
  groupWorkspace: approvedProcedure.input(z.object({ groupId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const access = await assertGroupAccess(ctx.user, input.groupId);
    const workspace = await db.getGroupWorkspace(input.groupId);
    if (!workspace) throw new TRPCError({ code: "NOT_FOUND", message: "Grupo de Trabalho não encontrado." });
    return { ...workspace, access };
  }),
  saveWorksheet: approvedProcedure.input(z.object({
    groupId: z.number().int().positive(),
    lens: z.enum(worksheetLenses),
    classification: z.enum(classificationOptions).nullable().optional(),
    selectedEventIds: z.string().nullable().optional(),
    testEntries: z.string().nullable().optional(),
    includeAsAppendix: z.boolean().optional(),
    centralJudgment: z.string().nullable().optional(),
    evidenceBasis: z.string().nullable().optional(),
    limitsAndAlternatives: z.string().nullable().optional(),
    clarificationNeeded: z.string().nullable().optional(),
    integrationInput: z.string().nullable().optional(),
    status: worksheetStatusSchema,
  })).mutation(async ({ ctx, input }) => {
    const access = await assertGroupAccess(ctx.user, input.groupId);
    if (input.status === "versao_final" && !access.canFinalize) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Somente o dirigente ou relator pode finalizar a ficha." });
    }
    if (input.status === "versao_final" && !isWorksheetComplete(input)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Preencha a classificação e os cinco parágrafos para finalizar a ficha." });
    }
    await db.saveWorksheet(input.groupId, ctx.user.id, input);
    const deliverableByLens = {
      guerra_hibrida: "ficha_guerra_hibrida",
      lawfare: "ficha_lawfare",
      seguranca_transnacional: "ficha_seguranca_transnacional",
    } as const;
    await db.setDeliverableStatus({
      groupId: input.groupId,
      type: deliverableByLens[input.lens],
      status: input.status,
      checklistConfirmed: false,
      userId: ctx.user.id,
    });
    return { success: true };
  }),
  saveSynthesis: approvedProcedure.input(z.object({
    groupId: z.number().int().positive(),
    selectedEventIds: z.string().nullable().optional(),
    connectionNotes: z.string().nullable().optional(),
    includeMatrixAsAppendix: z.boolean().optional(),
    strategicJudgment: z.string().nullable().optional(),
    lensResults: z.string().nullable().optional(),
    connectionsAndLimits: z.string().nullable().optional(),
    missionResponse: z.string().nullable().optional(),
    recommendations: z.string().nullable().optional(),
    desiredEndState: z.string().nullable().optional(),
    slideOne: z.string().nullable().optional(),
    slideTwo: z.string().nullable().optional(),
    slideThree: z.string().nullable().optional(),
    slideFour: z.string().nullable().optional(),
    status: worksheetStatusSchema,
  })).mutation(async ({ ctx, input }) => {
    const access = await assertGroupAccess(ctx.user, input.groupId);
    if (input.status === "versao_final" && !access.canFinalize) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Somente o dirigente ou relator pode finalizar a síntese." });
    }
    if (input.status === "versao_final" && !isSynthesisComplete(input)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Preencha os seis blocos e os quatro slides para finalizar a síntese." });
    }
    await db.saveIntegratedSynthesis(input.groupId, ctx.user.id, input);
    await db.setDeliverableStatus({
      groupId: input.groupId,
      type: "sintese_integrada",
      status: input.status,
      checklistConfirmed: false,
      userId: ctx.user.id,
    });
    return { success: true };
  }),
  setDeliverableStatus: approvedProcedure.input(z.object({
    groupId: z.number().int().positive(), type: deliverableTypeSchema, status: deliverableStatusSchema, checklistConfirmed: z.boolean(),
  })).mutation(async ({ ctx, input }) => {
    const access = await assertGroupAccess(ctx.user, input.groupId);
    if (["versao_final", "submetido"].includes(input.status) && !access.canFinalize) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Somente o dirigente ou relator pode registrar uma versão final ou submissão." });
    }
    if (input.status === "submetido") {
      const workspace = await db.getGroupWorkspace(input.groupId);
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND", message: "Grupo de Trabalho não encontrado." });
      const worksheetByDeliverable = {
        ficha_guerra_hibrida: "guerra_hibrida",
        ficha_lawfare: "lawfare",
        ficha_seguranca_transnacional: "seguranca_transnacional",
      } as const;
      const worksheetLens = worksheetByDeliverable[input.type as keyof typeof worksheetByDeliverable];
      const contentFinalized = worksheetLens
        ? workspace.worksheets.some(item => item.lens === worksheetLens && item.status === "versao_final")
        : input.type === "sintese_integrada"
          ? workspace.synthesis?.status === "versao_final"
          : Boolean(workspace.synthesis?.slideOne && workspace.synthesis?.slideTwo && workspace.synthesis?.slideThree && workspace.synthesis?.slideFour);
      if (!canRegisterSubmission(input.status, contentFinalized, input.checklistConfirmed)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A submissão exige conteúdo finalizado e checklist confirmado." });
      }
    }
    await db.setDeliverableStatus({ ...input, userId: ctx.user.id });
    return { success: true };
  }),
  setAppendix: approvedProcedure.input(z.object({
    groupId: z.number().int().positive(),
    source: z.enum(["worksheet", "integration"]),
    lens: z.enum(worksheetLenses).optional(),
    include: z.boolean(),
  })).mutation(async ({ ctx, input }) => {
    await assertGroupAccess(ctx.user, input.groupId);
    if (input.source === "worksheet") {
      if (!input.lens) throw new TRPCError({ code: "BAD_REQUEST", message: "A lente da Matriz de Teste é obrigatória." });
      await db.setWorksheetAppendix(input.groupId, ctx.user.id, input.lens, input.include);
    } else {
      await db.setIntegrationMatrixAppendix(input.groupId, ctx.user.id, input.include);
    }
    return { success: true };
  }),
  admin: router({
    groups: approvedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.listWorkGroups();
    }),
    deliveryOverview: approvedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAdminDeliveryOverview();
    }),
    initializeOfficialGroups: approvedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const groups = await db.initializeOfficialWorkGroups();
      return { count: groups.length };
    }),
    participants: approvedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.listParticipants();
    }),
    createGroup: approvedProcedure.input(z.object({ code: z.string().min(3).max(16), missionAxis: z.string().min(2), missionText: z.string().min(20), presentationSlot: z.string().max(80).nullable().optional() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return { id: await db.createWorkGroup(input) };
    }),
    assignParticipant: approvedProcedure.input(z.object({ groupId: z.number().int().positive(), userId: z.number().int().positive(), role: groupRoleSchema, course: z.string().max(160).nullable().optional() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await db.assignParticipant(input);
      return { success: true };
    }),
    removeParticipant: approvedProcedure.input(z.object({ groupId: z.number().int().positive(), userId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await db.removeParticipantFromGroup(input);
      return { success: true };
    }),
    getSettings: approvedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getExerciseSettings();
    }),
    saveSettings: approvedProcedure.input(z.object({ coordinationNote: z.string().nullable().optional(), finalSubmissionInstructions: z.string().nullable().optional(), exerciseOpen: z.boolean() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await db.saveExerciseSettings({ ...input, userId: ctx.user.id });
      return { success: true };
    }),
  }),
});
