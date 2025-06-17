
import { z } from 'zod';

// Application schema
export const applicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  company_name: z.string(),
  project_description: z.string(),
  desired_features: z.string(),
  created_at: z.coerce.date(),
  status: z.enum(['pending', 'reviewed', 'approved', 'rejected']).default('pending')
});

export type Application = z.infer<typeof applicationSchema>;

// Input schema for creating applications
export const createApplicationInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  company_name: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  project_description: z.string().min(10, 'Please provide at least 10 characters for project description').max(1000, 'Project description must be less than 1000 characters'),
  desired_features: z.string().min(10, 'Please provide at least 10 characters for desired features').max(1000, 'Desired features must be less than 1000 characters')
});

export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

// Schema for getting applications with optional filtering
export const getApplicationsInputSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'approved', 'rejected']).optional(),
  limit: z.number().int().positive().max(100).default(50).optional(),
  offset: z.number().int().nonnegative().default(0).optional()
});

export type GetApplicationsInput = z.infer<typeof getApplicationsInputSchema>;

// Schema for updating application status
export const updateApplicationStatusInputSchema = z.object({
  id: z.number(),
  status: z.enum(['pending', 'reviewed', 'approved', 'rejected'])
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusInputSchema>;
