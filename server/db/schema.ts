import { pgTable, serial, text, integer, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  stripe_customer_id: varchar('stripe_customer_id', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  stripe_session_id: varchar('stripe_session_id', { length: 255 }).unique(),
  stripe_subscription_id: varchar('stripe_subscription_id', { length: 255 }),
  tier_id: varchar('tier_id', { length: 50 }).notNull(),
  amount: integer('amount'),
  status: varchar('status', { length: 50 }).default('pending'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  stripe_subscription_id: varchar('stripe_subscription_id', { length: 255 }).unique(),
  tier_id: varchar('tier_id', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('active'),
  current_period_start: timestamp('current_period_start'),
  current_period_end: timestamp('current_period_end'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});
