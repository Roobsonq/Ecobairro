import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const usersRouter = router({
  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Update user profile
  update: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        neighborhood: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user is updating their own profile
      if (input.userId !== ctx.user?.id) {
        throw new Error("Unauthorized: You can only update your own profile");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: Record<string, any> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.email !== undefined) updateData.email = input.email;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.address !== undefined) updateData.address = input.address;
      if (input.neighborhood !== undefined) updateData.neighborhood = input.neighborhood;
      updateData.updatedAt = new Date();

      const result = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Get user by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      return result[0] || null;
    }),

  // List all users by role (admin only)
  listByRole: protectedProcedure
    .input(z.object({ role: z.enum(["morador", "prefeitura", "cooperativa", "admin"]) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(users)
        .where(eq(users.role, input.role));

      return result;
    }),

  // Get user statistics (admin only)
  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allUsers = await db.select().from(users);

    const stats = {
      total: allUsers.length,
      moradores: allUsers.filter(u => u.role === "morador").length,
      prefeitura: allUsers.filter(u => u.role === "prefeitura").length,
      cooperativas: allUsers.filter(u => u.role === "cooperativa").length,
      admins: allUsers.filter(u => u.role === "admin").length,
    };

    return stats;
  }),
});
