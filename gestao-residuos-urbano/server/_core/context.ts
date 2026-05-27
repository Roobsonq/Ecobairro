import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Usuário mockado para remover a necessidade de autenticação real
  const mockUser: User = {
    id: 1,
    openId: "mock-user-id",
    name: "Usuário EcoBairro",
    email: "usuario@ecobairo.com.br",
    loginMethod: "local",
    role: "admin", // Definido como admin para garantir acesso a todas as rotas
    phone: "11999999999",
    address: "Rua Sustentável, 123",
    neighborhood: "Bairro Verde",
    latitude: "0",
    longitude: "0",
    engagementScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    req: opts.req,
    res: opts.res,
    user: mockUser,
  };
}
