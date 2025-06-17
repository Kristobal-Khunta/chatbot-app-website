
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type Application } from '../schema';
import { eq } from 'drizzle-orm';

export const getApplicationById = async (id: number): Promise<Application | null> => {
  try {
    const result = await db.select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, id))
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Failed to get application by id:', error);
    throw error;
  }
};
