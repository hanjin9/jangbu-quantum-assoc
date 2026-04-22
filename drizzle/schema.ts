import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "owner"]).default("user").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Orders table for tracking all purchases
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  tierId: varchar("tier_id", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Subscriptions table for managing active subscriptions
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique().notNull(),
  tierId: varchar("tier_id", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled", "expired"]).default("active").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Practitioners table for storing practitioner information
 */
export const practitioners = mysqlTable("practitioners", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  experience: int("experience").notNull(),
  bio: text("bio"),
  imageUrl: varchar("image_url", { length: 500 }),
  certifications: text("certifications"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Practitioner = typeof practitioners.$inferSelect;
export type InsertPractitioner = typeof practitioners.$inferInsert;

/**
 * Email logs table for tracking sent emails
 */
export const emailLogs = mysqlTable("email_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  recipientEmail: varchar("recipient_email", { length: 320 }).notNull(),
  emailType: varchar("email_type", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 500 }),
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).default("sent").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;


/**
 * Live stream chat messages table
 */
export const liveStreamChats = mysqlTable("live_stream_chats", {
  id: int("id").autoincrement().primaryKey(),
  streamId: int("stream_id").notNull(),
  userId: int("user_id").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isInstructorReply: int("is_instructor_reply").default(0).notNull(),
  replyToMessageId: int("reply_to_message_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LiveStreamChat = typeof liveStreamChats.$inferSelect;
export type InsertLiveStreamChat = typeof liveStreamChats.$inferInsert;


/**
 * Refunds table for tracking refund transactions
 */
export const refunds = mysqlTable("refunds", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("order_id").notNull(),
  userId: int("user_id").notNull(),
  stripeRefundId: varchar("stripe_refund_id", { length: 255 }).unique(),
  stripeChargeId: varchar("stripe_charge_id", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed"]).default("pending").notNull(),
  adminId: int("admin_id").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = typeof refunds.$inferInsert;

/**
 * Subscription cancellations table for tracking cancellation details
 */
export const subscriptionCancellations = mysqlTable("subscription_cancellations", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscription_id").notNull(),
  userId: int("user_id").notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundId: int("refund_id"),
  cancelledBy: mysqlEnum("cancelled_by", ["user", "admin"]).notNull(),
  adminId: int("admin_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SubscriptionCancellation = typeof subscriptionCancellations.$inferSelect;
export type InsertSubscriptionCancellation = typeof subscriptionCancellations.$inferInsert;


/**
 * User Profiles table for extended profile information
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  avatarUrl: text("avatar_url"),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Social Logins table for Kakao, Naver, Phone authentication
 */
export const socialLogins = mysqlTable("social_logins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  providerName: varchar("provider_name", { length: 255 }),
  providerEmail: varchar("provider_email", { length: 320 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SocialLogin = typeof socialLogins.$inferSelect;
export type InsertSocialLogin = typeof socialLogins.$inferInsert;




/**
 * JWT sessions table for managing user sessions and tokens
 */
export const jwtSessions = mysqlTable("jwt_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: text("token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type JWTSession = typeof jwtSessions.$inferSelect;
export type InsertJWTSession = typeof jwtSessions.$inferInsert;

/**
 * Email verification tokens table
 */
export const emailVerificationTokens = mysqlTable("email_verification_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  isVerified: int("is_verified").default(0).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type InsertEmailVerificationToken = typeof emailVerificationTokens.$inferInsert;

/**
 * Certification verification table
 */
export const certifications = mysqlTable("certifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  certificationName: varchar("certification_name", { length: 255 }).notNull(),
  certificationNumber: varchar("certification_number", { length: 255 }).notNull().unique(),
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  certificateUrl: text("certificate_url"),
  status: mysqlEnum("status", ["pending", "verified", "rejected", "expired"]).default("pending").notNull(),
  verifiedBy: int("verified_by"),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;

/**
 * User notifications table
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedEntityType: varchar("related_entity_type", { length: 50 }),
  relatedEntityId: int("related_entity_id"),
  isRead: int("is_read").default(0).notNull(),
  isPushSent: int("is_push_sent").default(0).notNull(),
  isEmailSent: int("is_email_sent").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Push notification subscriptions table
 */
export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  endpoint: text("endpoint").notNull(),
  auth: varchar("auth", { length: 255 }).notNull(),
  p256dh: varchar("p256dh", { length: 255 }).notNull(),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

/**
 * Certificates table for tracking issued certificates after payment/course completion
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  orderId: int("order_id"),
  courseId: varchar("course_id", { length: 100 }).notNull(),
  courseName: varchar("course_name", { length: 255 }).notNull(),
  certificateNumber: varchar("certificate_number", { length: 255 }).notNull().unique(),
  verificationCode: varchar("verification_code", { length: 64 }).notNull().unique(),
  certificatePdfUrl: text("certificate_pdf_url"),
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date"),
  status: mysqlEnum("status", ["active", "revoked", "expired"]).default("active").notNull(),
  revokeReason: text("revoke_reason"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Course lectures table for storing course and lecture information
 */
export const courseLectures = mysqlTable("course_lectures", {
  id: int("id").autoincrement().primaryKey(),
  courseId: varchar("course_id", { length: 100 }).notNull().unique(),
  courseName: varchar("course_name", { length: 255 }).notNull(),
  courseLevel: varchar("course_level", { length: 50 }).notNull(),
  courseDescription: text("course_description"),
  instructorName: varchar("instructor_name", { length: 255 }),
  instructorEmail: varchar("instructor_email", { length: 320 }),
  durationMinutes: int("duration_minutes").notNull(),
  minimumPassingMinutes: int("minimum_passing_minutes").notNull(),
  videoUrl: text("video_url"),
  courseImageUrl: text("course_image_url"),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CourseLecture = typeof courseLectures.$inferSelect;
export type InsertCourseLecture = typeof courseLectures.$inferInsert;

/**
 * Lecture progress table for tracking user's course progress
 */
export const lectureProgress = mysqlTable("lecture_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  courseId: varchar("course_id", { length: 100 }).notNull(),
  watchedMinutes: int("watched_minutes").default(0).notNull(),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0.00").notNull(),
  isCompleted: int("is_completed").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  certificateId: int("certificate_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LectureProgress = typeof lectureProgress.$inferSelect;
export type InsertLectureProgress = typeof lectureProgress.$inferInsert;


/**
 * SMS OTP Verification table for phone-based authentication
 */
export const smsVerifications = mysqlTable("sms_verifications", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  otpCode: varchar("otp_code", { length: 6 }).notNull(),
  isVerified: int("is_verified").default(0).notNull(),
  userId: int("user_id"),
  expiresAt: timestamp("expires_at").notNull(),
  attemptCount: int("attempt_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SmsVerification = typeof smsVerifications.$inferSelect;
export type InsertSmsVerification = typeof smsVerifications.$inferInsert;

/**
 * SMS Login Sessions table for tracking SMS-based login sessions
 */
export const smsLoginSessions = mysqlTable("sms_login_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).unique().notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  userId: int("user_id"),
  isVerified: int("is_verified").default(0).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SmsLoginSession = typeof smsLoginSessions.$inferSelect;
export type InsertSmsLoginSession = typeof smsLoginSessions.$inferInsert;
