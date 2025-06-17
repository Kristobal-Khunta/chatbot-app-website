
import { serial, text, pgTable, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Define enum for application status
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'reviewed', 'approved', 'rejected']);

export const applicationsTable = pgTable('applications', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company_name: text('company_name').notNull(),
  project_description: text('project_description').notNull(),
  desired_features: text('desired_features').notNull(),
  status: applicationStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type Application = typeof applicationsTable.$inferSelect;
export type NewApplication = typeof applicationsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { applications: applicationsTable };
