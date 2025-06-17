
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type UpdateApplicationStatusInput, type CreateApplicationInput } from '../schema';
import { updateApplicationStatus } from '../handlers/update_application_status';
import { eq } from 'drizzle-orm';

// Test input for creating an application
const testApplicationInput: CreateApplicationInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  company_name: 'Test Company',
  project_description: 'This is a test project description that meets minimum length requirements.',
  desired_features: 'These are the desired features for the test project with sufficient detail.'
};

describe('updateApplicationStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update application status from pending to reviewed', async () => {
    // Create a test application first
    const createdApp = await db.insert(applicationsTable)
      .values(testApplicationInput)
      .returning()
      .execute();

    const updateInput: UpdateApplicationStatusInput = {
      id: createdApp[0].id,
      status: 'reviewed'
    };

    const result = await updateApplicationStatus(updateInput);

    // Verify the updated status
    expect(result.id).toEqual(createdApp[0].id);
    expect(result.status).toEqual('reviewed');
    expect(result.name).toEqual(testApplicationInput.name);
    expect(result.email).toEqual(testApplicationInput.email);
    expect(result.company_name).toEqual(testApplicationInput.company_name);
    expect(result.project_description).toEqual(testApplicationInput.project_description);
    expect(result.desired_features).toEqual(testApplicationInput.desired_features);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save updated status to database', async () => {
    // Create a test application first
    const createdApp = await db.insert(applicationsTable)
      .values(testApplicationInput)
      .returning()
      .execute();

    const updateInput: UpdateApplicationStatusInput = {
      id: createdApp[0].id,
      status: 'approved'
    };

    await updateApplicationStatus(updateInput);

    // Query the database to verify the update was persisted
    const applications = await db.select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, createdApp[0].id))
      .execute();

    expect(applications).toHaveLength(1);
    expect(applications[0].status).toEqual('approved');
    expect(applications[0].name).toEqual(testApplicationInput.name);
  });

  it('should update status to all valid enum values', async () => {
    // Create a test application first
    const createdApp = await db.insert(applicationsTable)
      .values(testApplicationInput)
      .returning()
      .execute();

    const statusValues: Array<'pending' | 'reviewed' | 'approved' | 'rejected'> = 
      ['pending', 'reviewed', 'approved', 'rejected'];

    for (const status of statusValues) {
      const updateInput: UpdateApplicationStatusInput = {
        id: createdApp[0].id,
        status
      };

      const result = await updateApplicationStatus(updateInput);
      expect(result.status).toEqual(status);
    }
  });

  it('should throw error when application does not exist', async () => {
    const updateInput: UpdateApplicationStatusInput = {
      id: 99999, // Non-existent ID
      status: 'reviewed'
    };

    await expect(updateApplicationStatus(updateInput))
      .rejects.toThrow(/Application with id 99999 not found/i);
  });
});
