import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, datetime } from "drizzle-orm/mysql-core";

/**
 * Appointments table for managing practitioner schedules and bookings
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  practitionerId: int("practitioner_id").notNull(),
  appointmentDate: datetime("appointment_date").notNull(),
  duration: int("duration").default(60).notNull(), // in minutes
  status: mysqlEnum("status", ["scheduled", "confirmed", "completed", "cancelled", "no-show"]).default("scheduled").notNull(),
  notes: text("notes"),
  consultationType: varchar("consultation_type", { length: 50 }).default("general").notNull(), // general, follow-up, emergency
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  cancelledAt: timestamp("cancelled_at"),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Practitioner availability/schedule table
 */
export const practitionerSchedules = mysqlTable("practitioner_schedules", {
  id: int("id").autoincrement().primaryKey(),
  practitionerId: int("practitioner_id").notNull(),
  dayOfWeek: int("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM format
  endTime: varchar("end_time", { length: 5 }).notNull(),
  isAvailable: int("is_available").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PractitionerSchedule = typeof practitionerSchedules.$inferSelect;
export type InsertPractitionerSchedule = typeof practitionerSchedules.$inferInsert;

/**
 * Appointment reminders table
 */
export const appointmentReminders = mysqlTable("appointment_reminders", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointment_id").notNull(),
  reminderTime: datetime("reminder_time").notNull(), // When to send reminder
  reminderType: varchar("reminder_type", { length: 50 }).default("email").notNull(), // email, sms, push
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});

export type AppointmentReminder = typeof appointmentReminders.$inferSelect;
export type InsertAppointmentReminder = typeof appointmentReminders.$inferInsert;

/**
 * Consultation feedback/notes table
 */
export const consultationNotes = mysqlTable("consultation_notes", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointment_id").notNull(),
  practitionerId: int("practitioner_id").notNull(),
  userId: int("user_id").notNull(),
  notes: text("notes"),
  recommendations: text("recommendations"),
  followUpRequired: int("follow_up_required").default(0).notNull(),
  nextAppointmentSuggested: datetime("next_appointment_suggested"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ConsultationNote = typeof consultationNotes.$inferSelect;
export type InsertConsultationNote = typeof consultationNotes.$inferInsert;
