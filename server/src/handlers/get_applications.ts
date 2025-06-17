
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type GetApplicationsInput, type Application } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getApplications = async (input?: GetApplicationsInput): Promise<Application[]> => {
  try {
    const limit = input?.limit ?? 50;
    const offset = input?.offset ?? 0;

    // Build query conditionally
    if (input?.status) {
      // Query with status filter
      const results = await db.select()
        .from(applicationsTable)
        .where(eq(applicationsTable.status, input.status))
        .orderBy(desc(applicationsTable.created_at))
        .limit(limit)
        .offset(offset)
        .execute();
      
      return results;
    } else {
      // Query without status filter
      const results = await db.select()
        .from(applicationsTable)
        .orderBy(desc(applicationsTable.created_at))
        .limit(limit)
        .offset(offset)
        .execute();
      
      return results;
    }
  } catch (error) {
    console.error('Get applications failed:', error);
    throw error;
  }
};
