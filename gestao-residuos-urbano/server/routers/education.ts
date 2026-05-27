import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getEducationContent, getEducationContentByCategory, getDb } from "../db";
import { educationContent as educationContentTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const educationRouter = router({
  list: publicProcedure.query(async () => {
    return getEducationContent();
  }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return getEducationContentByCategory(input.category);
    }),

  categories: publicProcedure.query(async () => {
    const content = await getEducationContent();
    const categorySet = new Set(content.map(c => c.category));
    const categories = Array.from(categorySet);
    return categories;
  }),

  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      materialType: z.string().optional(),
      content: z.string(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "prefeitura" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(educationContentTable).values({
        title: input.title,
        description: input.description,
        category: input.category,
        materialType: input.materialType,
        content: input.content,
        imageUrl: input.imageUrl,
      });

      return result;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      materialType: z.string().optional(),
      content: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "prefeitura" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.title) updateData.title = input.title;
      if (input.description) updateData.description = input.description;
      if (input.category) updateData.category = input.category;
      if (input.materialType) updateData.materialType = input.materialType;
      if (input.content) updateData.content = input.content;
      if (input.imageUrl) updateData.imageUrl = input.imageUrl;

      await db.update(educationContentTable).set(updateData).where(eq(educationContentTable.id, input.id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "prefeitura" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(educationContentTable).where(eq(educationContentTable.id, input.id));

      return { success: true };
    }),
});
