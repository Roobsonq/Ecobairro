import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getMetricsByMonth, createOrUpdateMetric, getNotificationsByUserId, markNotificationAsRead, getDb } from "../db";
import { notifications as notificationsTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const metricsRouter = router({
  getByMonth: protectedProcedure
    .input(z.object({ month: z.string() }))
    .query(async ({ input }) => {
      return getMetricsByMonth(input.month);
    }),

  getCurrentMonth: protectedProcedure.query(async () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return getMetricsByMonth(month);
  }),

  updateMetrics: protectedProcedure
    .input(z.object({
      month: z.string(),
      totalVolumeCollected: z.string(),
      baselineVolume: z.string(),
      percentageIncrease: z.string(),
      totalSchedules: z.number(),
      completedSchedules: z.number(),
      activeUsers: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "prefeitura" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return createOrUpdateMetric({
        month: input.month,
        totalVolumeCollected: input.totalVolumeCollected as any,
        baselineVolume: input.baselineVolume as any,
        percentageIncrease: input.percentageIncrease as any,
        totalSchedules: input.totalSchedules,
        completedSchedules: input.completedSchedules,
        activeUsers: input.activeUsers,
      });
    }),

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getNotificationsByUserId(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return markNotificationAsRead(input.id);
      }),

    markAllAsRead: protectedProcedure
      .mutation(async ({ ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.update(notificationsTable)
          .set({ isRead: true })
          .where(eq(notificationsTable.userId, ctx.user.id));

        return { success: true };
      }),
  }),
});
