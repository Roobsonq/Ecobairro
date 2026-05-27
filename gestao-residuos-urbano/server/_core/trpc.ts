import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Agora o protectedProcedure e adminProcedure não bloqueiam mais o acesso, 
// pois o contexto sempre terá um usuário mockado.
export const protectedProcedure = t.procedure;
export const adminProcedure = t.procedure;
