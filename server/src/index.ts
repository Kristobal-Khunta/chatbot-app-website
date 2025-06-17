
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

import { 
  createApplicationInputSchema, 
  getApplicationsInputSchema, 
  updateApplicationStatusInputSchema 
} from './schema';
import { createApplication } from './handlers/create_application';
import { getApplications } from './handlers/get_applications';
import { updateApplicationStatus } from './handlers/update_application_status';
import { getApplicationById } from './handlers/get_application_by_id';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new application
  createApplication: publicProcedure
    .input(createApplicationInputSchema)
    .mutation(({ input }) => createApplication(input)),
  
  // Get all applications with optional filtering
  getApplications: publicProcedure
    .input(getApplicationsInputSchema.optional())
    .query(({ input }) => getApplications(input)),
  
  // Get application by ID
  getApplicationById: publicProcedure
    .input(z.number())
    .query(({ input }) => getApplicationById(input)),
  
  // Update application status (for admin use)
  updateApplicationStatus: publicProcedure
    .input(updateApplicationStatusInputSchema)
    .mutation(({ input }) => updateApplicationStatus(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
