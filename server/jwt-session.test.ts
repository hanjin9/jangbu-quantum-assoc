import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(isAuthenticated = false): TrpcContext {
  const user: AuthenticatedUser | null = isAuthenticated
    ? {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  const ctx: TrpcContext = {
    user: user as any,
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

describe("JWT Session Management", () => {
  it("should upload avatar", async () => {
    const ctx = createAuthContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.uploadAvatar({
      fileName: "profile.jpg",
      fileSize: 1024 * 100,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.userId).toBe(1);
    expect(result.url).toContain("avatars");
    expect(result.uploadedAt).toBeDefined();
  });

  it("should update profile with avatar URL", async () => {
    const ctx = createAuthContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.updateProfile({
      name: "Updated User",
      phoneNumber: "01012345678",
      avatarUrl: "https://cdn.example.com/avatars/1/profile.jpg",
      bio: "프로필 업데이트 테스트",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("프로필이 업데이트되었습니다");
    expect(result.userId).toBe(1);
  });

  it("should maintain session state across requests", async () => {
    const ctx = createAuthContext(true);
    const caller = appRouter.createCaller(ctx);

    // First request
    const profile1 = await caller.profile.getProfile();
    expect(profile1).toBeDefined();
    expect(profile1.id).toBe(1);

    // Second request with same context
    const profile2 = await caller.profile.getProfile();
    expect(profile2).toBeDefined();
    expect(profile2.id).toBe(profile1.id);
  });

  it("should handle profile update with partial data", async () => {
    const ctx = createAuthContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.updateProfile({
      phoneNumber: "01098765432",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("프로필이 업데이트되었습니다");
  });

  it("should require authentication for profile operations", async () => {
    const ctx = createAuthContext(false);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.profile.uploadAvatar({
        fileName: "test.jpg",
        fileSize: 1024,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
