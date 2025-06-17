
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type UpdateApplicationStatusInput, type Application } from '../schema';
import { eq } from 'drizzle-orm';

export const updateApplicationStatus = async (input: UpdateApplicationStatusInput): Promise<Application> => {
  try {
    // First check if the application exists
    const existingApplication = await db.select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, input.id))
      .execute();

    if (existingApplication.length === 0) {
      throw new Error(`Application with id ${input.id} not found`);
    }

    // Update the application status
    const result = await db.update(applicationsTable)
      .set({
        status: input.status
      })
      .where(eq(applicationsTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Application status update failed:', error);
    throw error;
  }
};
