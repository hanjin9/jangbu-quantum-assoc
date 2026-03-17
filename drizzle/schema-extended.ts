import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * 게시판 (Board/Posts)
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // "notice", "free", "qa"
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  views: int("views").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * 댓글 (Comments)
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id").notNull(),
  userId: int("user_id").notNull(),
  content: text("content").notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * 커뮤니티 (Community)
 */
export const communityGroups = mysqlTable("community_groups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // "vip_lounge", "study", "experience"
  memberCount: int("member_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CommunityGroup = typeof communityGroups.$inferSelect;
export type InsertCommunityGroup = typeof communityGroups.$inferInsert;

/**
 * 커뮤니티 멤버
 */
export const communityMembers = mysqlTable("community_members", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("group_id").notNull(),
  userId: int("user_id").notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type CommunityMember = typeof communityMembers.$inferSelect;
export type InsertCommunityMember = typeof communityMembers.$inferInsert;

/**
 * 실기시험 (Practical Exams)
 */
export const practicalExams = mysqlTable("practical_exams", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).notNull(),
  duration: int("duration").notNull(), // minutes
  passingScore: decimal("passing_score", { precision: 5, scale: 2 }).notNull(),
  totalQuestions: int("total_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PracticalExam = typeof practicalExams.$inferSelect;
export type InsertPracticalExam = typeof practicalExams.$inferInsert;

/**
 * 시험 문제 (Exam Questions)
 */
export const examQuestions = mysqlTable("exam_questions", {
  id: int("id").autoincrement().primaryKey(),
  examId: int("exam_id").notNull(),
  question: text("question").notNull(),
  type: mysqlEnum("type", ["multiple_choice", "short_answer", "essay"]).notNull(),
  options: json("options"), // For multiple choice
  correctAnswer: text("correct_answer"),
  points: decimal("points", { precision: 5, scale: 2 }).notNull(),
  order: int("order").notNull(),
});

export type ExamQuestion = typeof examQuestions.$inferSelect;
export type InsertExamQuestion = typeof examQuestions.$inferInsert;

/**
 * 시험 응시 기록 (Exam Attempts)
 */
export const examAttempts = mysqlTable("exam_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  examId: int("exam_id").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["in_progress", "submitted", "passed", "failed"]).notNull(),
  answers: json("answers"), // User answers
  startedAt: timestamp("started_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ExamAttempt = typeof examAttempts.$inferSelect;
export type InsertExamAttempt = typeof examAttempts.$inferInsert;

/**
 * 자격증 (Certifications)
 */
export const certifications = mysqlTable("certifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  certificationName: varchar("certification_name", { length: 255 }).notNull(),
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  certificateNumber: varchar("certificate_number", { length: 100 }).unique().notNull(),
  status: mysqlEnum("status", ["active", "expired", "revoked"]).default("active").notNull(),
  verificationCode: varchar("verification_code", { length: 100 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;

/**
 * 수료증 (Completion Certificates)
 */
export const completionCertificates = mysqlTable("completion_certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  programName: varchar("program_name", { length: 255 }).notNull(),
  completionDate: timestamp("completion_date").notNull(),
  certificateNumber: varchar("certificate_number", { length: 100 }).unique().notNull(),
  certificateUrl: text("certificate_url"),
  verificationCode: varchar("verification_code", { length: 100 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CompletionCertificate = typeof completionCertificates.$inferSelect;
export type InsertCompletionCertificate = typeof completionCertificates.$inferInsert;

/**
 * 자격 검증 (Credential Verification)
 */
export const credentialVerifications = mysqlTable("credential_verifications", {
  id: int("id").autoincrement().primaryKey(),
  certificateId: int("certificate_id").notNull(),
  verifiedBy: int("verified_by"),
  verificationDate: timestamp("verification_date"),
  status: mysqlEnum("status", ["pending", "verified", "rejected"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CredentialVerification = typeof credentialVerifications.$inferSelect;
export type InsertCredentialVerification = typeof credentialVerifications.$inferInsert;

/**
 * 사용자 자격 (User Credentials)
 */
export const userCredentials = mysqlTable("user_credentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  certifications: json("certifications"), // Array of certification IDs
  completionCertificates: json("completion_certificates"), // Array of completion certificate IDs
  qualificationLevel: mysqlEnum("qualification_level", ["none", "beginner", "intermediate", "advanced", "expert"]).default("none").notNull(),
  verificationStatus: mysqlEnum("verification_status", ["unverified", "verified", "certified"]).default("unverified").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserCredential = typeof userCredentials.$inferSelect;
export type InsertUserCredential = typeof userCredentials.$inferInsert;
