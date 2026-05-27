import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDisposalPoints, getDisposalPointById, getDb } from "../db";
import { disposalPoints as disposalPointsTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const disposalRouter = router({
  list: publicProcedure.query(async () => {
    return getDisposalPoints();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getDisposalPointById(input.id);
    }),

  listByMaterialType: publicProcedure
    .input(z.object({ materialType: z.string() }))
    .query(async ({ input }) => {
      const points = await getDisposalPoints();
      return points.filter(point => 
        (point.materialTypes as string[]).includes(input.materialType)
      );
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      address: z.string(),
      neighborhood: z.string(),
      latitude: z.string(),
      longitude: z.string(),
      materialTypes: z.array(z.string()),
      phone: z.string().optional(),
      operatingHours: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "prefeitura" && ctx.user.role !== "cooperativa") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(disposalPointsTable).values({
        name: input.name,
        address: input.address,
        neighborhood: input.neighborhood,
        latitude: input.latitude,
        longitude: input.longitude,
        materialTypes: input.materialTypes,
        phone: input.phone,
        operatingHours: input.operatingHours,
        description: input.description,
      });

      return result;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      address: z.string().optional(),
      neighborhood: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      materialTypes: z.array(z.string()).optional(),
      phone: z.string().optional(),
      operatingHours: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "prefeitura" && ctx.user.role !== "cooperativa") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.address) updateData.address = input.address;
      if (input.neighborhood) updateData.neighborhood = input.neighborhood;
      if (input.latitude) updateData.latitude = input.latitude;
      if (input.longitude) updateData.longitude = input.longitude;
      if (input.materialTypes) updateData.materialTypes = input.materialTypes;
      if (input.phone) updateData.phone = input.phone;
      if (input.operatingHours) updateData.operatingHours = input.operatingHours;
      if (input.description) updateData.description = input.description;

      await db.update(disposalPointsTable).set(updateData).where(eq(disposalPointsTable.id, input.id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "prefeitura" && ctx.user.role !== "cooperativa") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(disposalPointsTable).where(eq(disposalPointsTable.id, input.id));

      return { success: true };
    }),
});
