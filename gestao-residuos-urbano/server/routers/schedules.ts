import { z } from "zod";
import { protectedProcedure, router } from "../\_core/trpc";
import { 
  createSchedule, 
  getSchedulesByUserId, 
  getScheduleById, 
  updateScheduleStatus,
  createNotification,
  getDb
} from "../db";
import { schedules as schedulesTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const schedulesRouter = router({
  create: protectedProcedure
    .input(z.object({
      materialType: z.string(),
      estimatedVolume: z.enum(["pequeno", "médio", "grande"]),
      address: z.string(),
      neighborhood: z.string(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      notes: z.string().optional(),
      scheduledDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const schedule = await createSchedule({
        userId: ctx.user.id,
        materialType: input.materialType,
        estimatedVolume: input.estimatedVolume,
        address: input.address,
        neighborhood: input.neighborhood,
        latitude: input.latitude as any,
        longitude: input.longitude as any,
        notes: input.notes,
        scheduledDate: input.scheduledDate,
        status: "pendente",
      });

      // Criar notificação para o usuário
      await createNotification({
        userId: ctx.user.id,
        title: "Agendamento Criado",
        message: `Seu agendamento de coleta de ${input.materialType} foi criado com sucesso.`,
        type: "agendamento",
      });

      return schedule;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return getSchedulesByUserId(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getScheduleById(input.id);
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pendente", "confirmado", "concluído"]),
      collectedVolume: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const schedule = await getScheduleById(input.id);
      
      // Verificar se o usuário é o dono ou é administrador
      if (schedule?.userId !== ctx.user.id && ctx.user.role !== "prefeitura" && ctx.user.role !== "cooperativa") {
        throw new Error("Unauthorized");
      }

      const result = await updateScheduleStatus(input.id, input.status);

      // Criar notificação
      const statusMessages: Record<string, string> = {
        "pendente": "Seu agendamento está pendente",
        "confirmado": "Seu agendamento foi confirmado",
        "concluído": "Sua coleta foi concluída",
      };

      await createNotification({
        userId: schedule!.userId,
        title: "Status da Coleta Atualizado",
        message: statusMessages[input.status],
        type: "coleta",
        relatedScheduleId: input.id,
      });

      return result;
    }),

  listAll: protectedProcedure.query(async ({ ctx }) => {
    // Apenas prefeitura e cooperativas podem ver todos os agendamentos
    if (ctx.user.role !== "prefeitura" && ctx.user.role !== "cooperativa") {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    return db.select().from(schedulesTable);
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const schedule = await getScheduleById(input.id);
      
      if (schedule?.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(schedulesTable).where(eq(schedulesTable.id, input.id));
      
      return { success: true };
    }),
});
