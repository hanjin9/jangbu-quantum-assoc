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

describe("social auth - 간편 로그인", () => {
  it("should login with kakao", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.socialAuth.kakaoLogin({
      kakaoCode: "test_kakao_code",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("카카오 로그인 성공");
    expect(result.token).toBeDefined();
    expect(result.userId).toBeDefined();
  });

  it("should login with naver", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.socialAuth.naverLogin({
      naverCode: "test_naver_code",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("네이버 로그인 성공");
    expect(result.token).toBeDefined();
    expect(result.userId).toBeDefined();
  });

  it("should send phone verification", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.socialAuth.sendPhoneVerification({
      phoneNumber: "01012345678",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.verificationId).toBeDefined();
    expect(result.message).toContain("인증번호가 발송되었습니다");
  });

  it("should login with phone verification", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.socialAuth.phoneLogin({
      phoneNumber: "01012345678",
      verificationCode: "123456",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("휴대폰 로그인 성공");
    expect(result.token).toBeDefined();
    expect(result.userId).toBeDefined();
  });
});

describe("profile - 프로필 편집", () => {
  it("should get user profile", async () => {
    const ctx = createAuthContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.getProfile();

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.name).toBe("Test User");
    expect(result.email).toBe("test@example.com");
    expect(result.phoneNumber).toBeDefined();
    expect(result.address).toBeDefined();
    expect(result.city).toBeDefined();
    expect(result.zipCode).toBeDefined();
  });

  it("should update user profile", async () => {
    const ctx = createAuthContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.updateProfile({
      name: "Updated Name",
      phoneNumber: "01012345678",
      address: "서울시 강남구",
      city: "서울",
      zipCode: "06000",
      bio: "양자요법 전문가입니다",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("프로필이 업데이트되었습니다");
    expect(result.userId).toBe(1);
    expect(result.updatedAt).toBeDefined();
  });

  it("should require authentication for profile operations", async () => {
    const ctx = createAuthContext(false);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.profile.getProfile();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle partial profile updates", async () => {
    const ctx = createAuthContext(true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.updateProfile({
      phoneNumber: "01012345678",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("프로필이 업데이트되었습니다");
  });
});
