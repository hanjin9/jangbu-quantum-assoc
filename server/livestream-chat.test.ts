import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("livestreamChat", () => {
  it("should send a message to livestream chat", async () => {
    const caller = appRouter.createCaller({
      user: {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "test",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {
        protocol: "https",
        headers: {},
      },
      res: {},
    });

    const result = await caller.livestreamChat.sendMessage({
      streamId: 1,
      message: "이 강의 정말 좋습니다!",
    });

    expect(result.success).toBe(true);
    expect(result.streamId).toBe(1);
    expect(result.message).toBe("이 강의 정말 좋습니다!");
    expect(result.userName).toBe("Test User");
  });

  it("should retrieve messages from livestream", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} },
      res: {},
    });

    const result = await caller.livestreamChat.getMessages({
      streamId: 1,
      limit: 50,
    });

    expect(result.streamId).toBe(1);
    expect(Array.isArray(result.messages)).toBe(true);
    expect(result.messages.length).toBeGreaterThan(0);
    expect(result.messages[0]).toHaveProperty("userName");
    expect(result.messages[0]).toHaveProperty("message");
  });

  it("should reply to a message", async () => {
    const caller = appRouter.createCaller({
      user: {
        id: 2,
        openId: "instructor-user",
        email: "instructor@example.com",
        name: "강사님",
        loginMethod: "test",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} },
      res: {},
    });

    const result = await caller.livestreamChat.replyToMessage({
      streamId: 1,
      messageId: 1,
      replyMessage: "좋은 질문입니다!",
    });

    expect(result.success).toBe(true);
    expect(result.replyToMessageId).toBe(1);
    expect(result.message).toBe("좋은 질문입니다!");
    expect(result.isInstructorReply).toBe(true);
  });
});
