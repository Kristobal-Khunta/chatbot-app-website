
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type CreateApplicationInput } from '../schema';
import { getApplicationById } from '../handlers/get_application_by_id';

// Test application input
const testInput: CreateApplicationInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  company_name: 'Test Company Inc',
  project_description: 'This is a test project description with sufficient length to meet requirements',
  desired_features: 'Feature 1, Feature 2, Feature 3 - these are the desired features for testing'
};

describe('getApplicationById', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return application by id', async () => {
    // Create test application
    const insertResult = await db.insert(applicationsTable)
      .values(testInput)
      .returning()
      .execute();

    const createdApplication = insertResult[0];

    // Get application by id
    const result = await getApplicationById(createdApplication.id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdApplication.id);
    expect(result!.name).toEqual('John Doe');
    expect(result!.email).toEqual('john.doe@example.com');
    expect(result!.company_name).toEqual('Test Company Inc');
    expect(result!.project_description).toEqual(testInput.project_description);
    expect(result!.desired_features).toEqual(testInput.desired_features);
    expect(result!.status).toEqual('pending');
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent id', async () => {
    const result = await getApplicationById(999);

    expect(result).toBeNull();
  });

  it('should return correct application when multiple exist', async () => {
    // Create multiple applications
    const app1 = await db.insert(applicationsTable)
      .values({ ...testInput, name: 'First App' })
      .returning()
      .execute();

    const app2 = await db.insert(applicationsTable)
      .values({ ...testInput, name: 'Second App' })
      .returning()
      .execute();

    // Get specific application
    const result = await getApplicationById(app2[0].id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(app2[0].id);
    expect(result!.name).toEqual('Second App');
    expect(result!.id).not.toEqual(app1[0].id);
  });
});
