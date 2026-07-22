import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "super_admin"]);
export const planEnum = pgEnum("plan", ["free", "pro", "premium"]);
export const sessionTypeEnum = pgEnum("training_session_type", ["diagnostic", "daily", "challenge_60"]);
export const sessionStatusEnum = pgEnum("training_session_status", ["started", "processing", "completed", "failed"]);

const auditColumns = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").notNull().default(false)
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 180 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("user"),
  plan: planEnum("plan").notNull().default("free"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  modifiedBy: uuid("modified_by"),
  ...auditColumns
});

export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "restrict" }),
  mainGoal: text("main_goal").notNull(),
  difficulties: jsonb("difficulties").$type<string[]>().notNull(),
  communicationLevel: varchar("communication_level", { length: 40 }).notNull(),
  communicationContexts: jsonb("communication_contexts").$type<string[]>().notNull(),
  currentScore: integer("current_score").notNull().default(0),
  currentProfileName: varchar("current_profile_name", { length: 120 }).notNull().default("Comunicador em evolucao"),
  modifiedBy: uuid("modified_by").notNull().references(() => users.id, { onDelete: "restrict" }),
  ...auditColumns
});

export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  primarySkill: varchar("primary_skill", { length: 80 }).notNull(),
  difficulty: varchar("difficulty", { length: 40 }).notNull(),
  preparationTime: integer("preparation_time").notNull().default(0),
  speakingTime: integer("speaking_time").notNull().default(60),
  active: boolean("active").notNull().default(true),
  modifiedBy: uuid("modified_by").references(() => users.id, { onDelete: "restrict" }),
  ...auditColumns
});

export const trainingSessions = pgTable("training_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  challengeId: uuid("challenge_id").notNull().references(() => challenges.id, { onDelete: "restrict" }),
  type: sessionTypeEnum("type").notNull(),
  status: sessionStatusEnum("status").notNull().default("started"),
  completedAt: timestamp("completed_at"),
  modifiedBy: uuid("modified_by").notNull().references(() => users.id, { onDelete: "restrict" }),
  ...auditColumns
});

export const attempts = pgTable("attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  trainingSessionId: uuid("training_session_id").notNull().references(() => trainingSessions.id, { onDelete: "restrict" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  attemptNumber: integer("attempt_number").notNull(),
  audioUrl: text("audio_url"),
  durationSeconds: integer("duration_seconds").notNull(),
  transcript: text("transcript").notNull(),
  wordCount: integer("word_count").notNull(),
  wordsPerMinute: integer("words_per_minute").notNull(),
  overallScore: integer("overall_score").notNull(),
  analysisJson: jsonb("analysis_json").$type<SpeechAnalysis>().notNull(),
  modifiedBy: uuid("modified_by").notNull().references(() => users.id, { onDelete: "restrict" }),
  ...auditColumns
});

export const userProgress = pgTable("user_progress", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "restrict" }),
  totalTrainings: integer("total_trainings").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  bestScore: integer("best_score").notNull().default(0),
  lastTrainingDate: timestamp("last_training_date"),
  clarityScore: integer("clarity_score").notNull().default(0),
  objectivityScore: integer("objectivity_score").notNull().default(0),
  structureScore: integer("structure_score").notNull().default(0),
  persuasionScore: integer("persuasion_score").notNull().default(0),
  perceivedConfidenceScore: integer("perceived_confidence_score").notNull().default(0),
  modifiedBy: uuid("modified_by").notNull().references(() => users.id, { onDelete: "restrict" }),
  ...auditColumns
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 120 }).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  modifiedBy: uuid("modified_by").references(() => users.id, { onDelete: "restrict" }),
  ...auditColumns
});

export type SpeechAnalysis = {
  nota_geral: number;
  clareza: number;
  objetividade: number;
  estrutura: number;
  persuasao: number;
  confianca_percebida: number;
  pontos_fortes: string[];
  pontos_melhoria: string[];
  vicios_linguagem: { palavra: string; quantidade: number }[];
  resumo_feedback: string;
  orientacao_principal: string;
  exercicio_recomendado: string;
};

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  progress: one(userProgress),
  sessions: many(trainingSessions)
}));

export const trainingSessionsRelations = relations(trainingSessions, ({ one, many }) => ({
  user: one(users, { fields: [trainingSessions.userId], references: [users.id] }),
  challenge: one(challenges, { fields: [trainingSessions.challengeId], references: [challenges.id] }),
  attempts: many(attempts)
}));
