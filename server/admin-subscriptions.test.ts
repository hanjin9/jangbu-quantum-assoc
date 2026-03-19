import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const adminUser: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("admin subscriptions", () => {
  it("should list subscriptions", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.listSubscriptions();

    expect(result).toBeDefined();
    expect(result.subscriptions).toBeInstanceOf(Array);
    expect(result.subscriptions.length).toBeGreaterThan(0);
    expect(result.subscriptions[0]).toHaveProperty("id");
    expect(result.subscriptions[0]).toHaveProperty("userName");
    expect(result.subscriptions[0]).toHaveProperty("status");
  });

  it("should cancel subscription", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.cancelSubscription({
      subscriptionId: 1,
      userId: 2,
      reason: "사용자 요청",
      refundAmount: 49.99,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.status).toBe("cancelled");
    expect(result.subscriptionId).toBe(1);
    expect(result.userId).toBe(2);
    expect(result.reason).toBe("사용자 요청");
  });

  it("should process refund", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.processRefund({
      subscriptionId: 1,
      userId: 2,
      orderId: 5,
      amount: 49.99,
      reason: "사용자 요청",
      notes: "고객 만족도 개선",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.status).toBe("succeeded");
    expect(result.userId).toBe(2);
    expect(result.amount).toBe(49.99);
    expect(result.reason).toBe("사용자 요청");
    expect(result.stripeRefundId).toBeDefined();
  });

  it("should get refund history", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getRefundHistory({
      userId: 2,
    });

    expect(result).toBeDefined();
    expect(result.refunds).toBeInstanceOf(Array);
    expect(result.refunds.length).toBeGreaterThan(0);
    expect(result.refunds[0]).toHaveProperty("id");
    expect(result.refunds[0]).toHaveProperty("userId");
    expect(result.refunds[0]).toHaveProperty("amount");
    expect(result.refunds[0]).toHaveProperty("status");
  });

  it("should reject non-admin users", async () => {
    const ctx: TrpcContext = {
      user: {
        id: 2,
        openId: "regular-user",
        email: "user@example.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.listSubscriptions();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
      expect((error as Error).message).toContain("관리자만");
    }
  });
});
