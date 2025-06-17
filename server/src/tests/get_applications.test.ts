
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type CreateApplicationInput, type GetApplicationsInput } from '../schema';
import { getApplications } from '../handlers/get_applications';

// Helper function to create test application
const createTestApplication = async (overrides: Partial<CreateApplicationInput> = {}) => {
  const testApplication = {
    name: 'John Doe',
    email: 'john@example.com',
    company_name: 'Test Company',
    project_description: 'This is a test project description with enough characters',
    desired_features: 'These are the desired features for the test project',
    ...overrides
  };

  const result = await db.insert(applicationsTable)
    .values(testApplication)
    .returning()
    .execute();

  return result[0];
};

describe('getApplications', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all applications with default pagination', async () => {
    // Create test applications
    await createTestApplication({ name: 'John Doe' });
    await createTestApplication({ name: 'Jane Smith', email: 'jane@example.com' });

    const result = await getApplications();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBeDefined();
    expect(result[0].email).toBeDefined();
    expect(result[0].status).toEqual('pending');
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should return applications ordered by created_at descending', async () => {
    // Create applications with slight delay to ensure different timestamps
    const first = await createTestApplication({ name: 'First Application' });
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    const second = await createTestApplication({ name: 'Second Application' });

    const result = await getApplications();

    expect(result).toHaveLength(2);
    // Most recent should be first
    expect(result[0].name).toEqual('Second Application');
    expect(result[1].name).toEqual('First Application');
    expect(result[0].created_at.getTime()).toBeGreaterThan(result[1].created_at.getTime());
  });

  it('should filter applications by status', async () => {
    // Create applications with different statuses
    await db.insert(applicationsTable)
      .values({
        name: 'Pending App',
        email: 'pending@example.com',
        company_name: 'Pending Company',
        project_description: 'Pending project description with enough characters',
        desired_features: 'Pending desired features for the test project',
        status: 'pending'
      })
      .execute();

    await db.insert(applicationsTable)
      .values({
        name: 'Approved App',
        email: 'approved@example.com',
        company_name: 'Approved Company',
        project_description: 'Approved project description with enough characters',
        desired_features: 'Approved desired features for the test project',
        status: 'approved'
      })
      .execute();

    const input: GetApplicationsInput = { status: 'approved' };
    const result = await getApplications(input);

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Approved App');
    expect(result[0].status).toEqual('approved');
  });

  it('should respect limit parameter', async () => {
    // Create 5 test applications
    for (let i = 0; i < 5; i++) {
      await createTestApplication({ 
        name: `Application ${i}`,
        email: `app${i}@example.com`
      });
    }

    const input: GetApplicationsInput = { limit: 3 };
    const result = await getApplications(input);

    expect(result).toHaveLength(3);
  });

  it('should respect offset parameter', async () => {
    // Create 3 test applications
    await createTestApplication({ name: 'First App' });
    await createTestApplication({ name: 'Second App' });
    await createTestApplication({ name: 'Third App' });

    const input: GetApplicationsInput = { offset: 1, limit: 2 };
    const result = await getApplications(input);

    expect(result).toHaveLength(2);
    // Should skip the first (most recent) application
    expect(result[0].name).not.toEqual('Third App');
  });

  it('should return empty array when no applications exist', async () => {
    const result = await getApplications();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return empty array when filtering by non-existent status', async () => {
    await createTestApplication();

    const input: GetApplicationsInput = { status: 'rejected' };
    const result = await getApplications(input);

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should work without input parameter', async () => {
    await createTestApplication();

    const result = await getApplications();

    expect(result).toHaveLength(1);
    expect(result[0].status).toEqual('pending');
  });
});
