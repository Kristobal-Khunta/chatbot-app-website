
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type CreateApplicationInput, type Application } from '../schema';

export const createApplication = async (input: CreateApplicationInput): Promise<Application> => {
  try {
    // Insert application record
    const result = await db.insert(applicationsTable)
      .values({
        name: input.name,
        email: input.email,
        company_name: input.company_name,
        project_description: input.project_description,
        desired_features: input.desired_features
        // status will default to 'pending' as defined in schema
        // created_at will default to now() as defined in schema
      })
      .returning()
      .execute();

    const application = result[0];
    return application;
  } catch (error) {
    console.error('Application creation failed:', error);
    throw error;
  }
};
