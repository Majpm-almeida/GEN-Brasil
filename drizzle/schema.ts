import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const workGroups = mysqlTable("workGroups", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  missionAxis: varchar("missionAxis", { length: 80 }).notNull(),
  missionText: text("missionText").notNull(),
  presentationSlot: varchar("presentationSlot", { length: 80 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const groupMembers = mysqlTable("groupMembers", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().references(() => workGroups.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: mysqlEnum("groupRole", ["dirigente", "relator", "integrante"]).default("integrante").notNull(),
  course: varchar("course", { length: 160 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("groupMemberUnique").on(table.groupId, table.userId),
  index("groupMembersUserIndex").on(table.userId),
]);

export const analyticalWorksheets = mysqlTable("analyticalWorksheets", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().references(() => workGroups.id, { onDelete: "cascade" }),
  lens: mysqlEnum("worksheetLens", ["guerra_hibrida", "lawfare", "seguranca_transnacional"]).notNull(),
  classification: varchar("classification", { length: 64 }),
  selectedEventIds: text("selectedEventIds"),
  testEntries: text("testEntries"),
  includeAsAppendix: boolean("includeAsAppendix").default(false).notNull(),
  centralJudgment: text("centralJudgment"),
  evidenceBasis: text("evidenceBasis"),
  limitsAndAlternatives: text("limitsAndAlternatives"),
  clarificationNeeded: text("clarificationNeeded"),
  integrationInput: text("integrationInput"),
  status: mysqlEnum("worksheetStatus", ["rascunho", "versao_final"]).default("rascunho").notNull(),
  updatedByUserId: int("updatedByUserId").references(() => users.id, { onDelete: "set null" }),
  finalizedAt: timestamp("finalizedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("groupLensUnique").on(table.groupId, table.lens)]);

export const integratedSyntheses = mysqlTable("integratedSyntheses", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().unique().references(() => workGroups.id, { onDelete: "cascade" }),
  selectedEventIds: text("selectedEventIds"),
  connectionNotes: text("connectionNotes"),
  includeMatrixAsAppendix: boolean("includeMatrixAsAppendix").default(false).notNull(),
  strategicJudgment: text("strategicJudgment"),
  lensResults: text("lensResults"),
  connectionsAndLimits: text("connectionsAndLimits"),
  missionResponse: text("missionResponse"),
  recommendations: text("recommendations"),
  desiredEndState: text("desiredEndState"),
  slideOne: text("slideOne"),
  slideTwo: text("slideTwo"),
  slideThree: text("slideThree"),
  slideFour: text("slideFour"),
  status: mysqlEnum("synthesisStatus", ["rascunho", "versao_final"]).default("rascunho").notNull(),
  updatedByUserId: int("updatedByUserId").references(() => users.id, { onDelete: "set null" }),
  finalizedAt: timestamp("finalizedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const deliverables = mysqlTable("deliverables", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().references(() => workGroups.id, { onDelete: "cascade" }),
  type: mysqlEnum("deliverableType", ["ficha_guerra_hibrida", "ficha_lawfare", "ficha_seguranca_transnacional", "sintese_integrada", "slides_finais"]).notNull(),
  status: mysqlEnum("deliverableStatus", ["pendente", "rascunho", "versao_final", "submetido"]).default("pendente").notNull(),
  checklistConfirmed: boolean("checklistConfirmed").default(false).notNull(),
  submittedAt: timestamp("submittedAt"),
  updatedByUserId: int("updatedByUserId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("groupDeliverableUnique").on(table.groupId, table.type)]);

export const exerciseSettings = mysqlTable("exerciseSettings", {
  id: int("id").autoincrement().primaryKey(),
  coordinationNote: text("coordinationNote"),
  finalSubmissionInstructions: text("finalSubmissionInstructions"),
  exerciseOpen: boolean("exerciseOpen").default(true).notNull(),
  updatedByUserId: int("updatedByUserId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GroupRole = "dirigente" | "relator" | "integrante";
