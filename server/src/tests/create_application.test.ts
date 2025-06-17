
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { applicationsTable } from '../db/schema';
import { type CreateApplicationInput } from '../schema';
import { createApplication } from '../handlers/create_application';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateApplicationInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  company_name: 'Test Company Inc',
  project_description: 'A comprehensive web application for managing business operations',
  desired_features: 'User authentication, dashboard, reporting, and mobile responsiveness'
};

describe('createApplication', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an application with all required fields', async () => {
    const result = await createApplication(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.company_name).toEqual('Test Company Inc');
    expect(result.project_description).toEqual(testInput.project_description);
    expect(result.desired_features).toEqual(testInput.desired_features);
    expect(result.status).toEqual('pending'); // Default status
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save application to database', async () => {
    const result = await createApplication(testInput);

    // Query using proper drizzle syntax
    const applications = await db.select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, result.id))
      .execute();

    expect(applications).toHaveLength(1);
    expect(applications[0].name).toEqual('John Doe');
    expect(applications[0].email).toEqual('john.doe@example.com');
    expect(applications[0].company_name).toEqual('Test Company Inc');
    expect(applications[0].project_description).toEqual(testInput.project_description);
    expect(applications[0].desired_features).toEqual(testInput.desired_features);
    expect(applications[0].status).toEqual('pending');
    expect(applications[0].created_at).toBeInstanceOf(Date);
  });

  it('should create multiple applications with unique IDs', async () => {
    const secondInput: CreateApplicationInput = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      company_name: 'Another Company LLC',
      project_description: 'E-commerce platform with advanced inventory management capabilities',
      desired_features: 'Shopping cart, payment processing, inventory tracking, and analytics'
    };

    const result1 = await createApplication(testInput);
    const result2 = await createApplication(secondInput);

    expect(result1.id).not.toEqual(result2.id);
    expect(result1.name).toEqual('John Doe');
    expect(result2.name).toEqual('Jane Smith');
    expect(result1.email).toEqual('john.doe@example.com');
    expect(result2.email).toEqual('jane.smith@example.com');
    
    // Both should have pending status by default
    expect(result1.status).toEqual('pending');
    expect(result2.status).toEqual('pending');
  });

  it('should handle different email formats correctly', async () => {
    const emailTestInput: CreateApplicationInput = {
      ...testInput,
      email: 'test.user+tag@subdomain.company.co.uk'
    };

    const result = await createApplication(emailTestInput);

    expect(result.email).toEqual('test.user+tag@subdomain.company.co.uk');
    
    // Verify in database
    const applications = await db.select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, result.id))
      .execute();

    expect(applications[0].email).toEqual('test.user+tag@subdomain.company.co.uk');
  });
});
