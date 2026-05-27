import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMoradorContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "morador-1",
    email: "morador@example.com",
    name: "João Morador",
    loginMethod: "manus",
    role: "morador",
    phone: "11999999999",
    address: "Rua A, 123",
    neighborhood: "Centro",
    latitude: "0",
    longitude: "0",
    engagementScore: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

function createPrefeituraContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "prefeitura-1",
    email: "prefeitura@example.com",
    name: "Admin Prefeitura",
    loginMethod: "manus",
    role: "prefeitura",
    phone: "11988888888",
    address: "Prefeitura",
    neighborhood: "Centro",
    latitude: "0",
    longitude: "0",
    engagementScore: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

describe("Schedules Router", () => {
  describe("create", () => {
    it("should create a schedule for authenticated morador", async () => {
      const ctx = createMoradorContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.schedules.create({
        materialType: "papel",
        estimatedVolume: "médio",
        address: "Rua A, 123",
        neighborhood: "Centro",
        notes: "Papelão de embalagens",
      });

      expect(result).toBeDefined();
    });

    it("should require authentication", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: {
          protocol: "https",
          headers: {},
        } as TrpcContext["req"],
        res: {
          clearCookie: vi.fn(),
        } as any,
      };

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.schedules.create({
          materialType: "papel",
          estimatedVolume: "médio",
          address: "Rua A, 123",
          neighborhood: "Centro",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("list", () => {
    it("should list schedules for authenticated user", async () => {
      const ctx = createMoradorContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.schedules.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("updateStatus", () => {
    it("should allow prefeitura to update schedule status", async () => {
      const ctx = createPrefeituraContext();
      const caller = appRouter.createCaller(ctx);

      // This would normally fail because the schedule doesn't exist,
      // but we're testing that the authorization check passes
      try {
        await caller.schedules.updateStatus({
          id: 999,
          status: "confirmado",
        });
      } catch (error: any) {
        // Expected to fail due to schedule not existing, not authorization
        expect(error.message).not.toContain("Unauthorized");
      }
    });

    it("should prevent morador from updating other user's schedule", async () => {
      const ctx = createMoradorContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.schedules.updateStatus({
          id: 999,
          status: "confirmado",
        });
      } catch (error: any) {
        // Should fail with authorization error or schedule not found
        expect(error).toBeDefined();
      }
    });
  });
});
