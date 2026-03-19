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
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
  userId: int("user_id").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
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
