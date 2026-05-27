import { publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { schedulesRouter } from "./routers/schedules";
import { disposalRouter } from "./routers/disposal";
import { educationRouter } from "./routers/education";
import { metricsRouter } from "./routers/metrics";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      return { success: true } as const;
    }),
  }),
  schedules: schedulesRouter,
  disposal: disposalRouter,
  education: educationRouter,
  metrics: metricsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
