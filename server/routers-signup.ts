import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users, userProfiles } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

/**
 * 회원가입 라우터
 */
export const signupRouter = router({
  /**
   * 회원가입 완료 - 사용자 정보 저장
   */
  completeSignup: publicProcedure
    .input(
      z.object({
        sessionToken: z.string(),
        name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
        age: z.string().regex(/^\d+$/, "나이는 숫자여야 합니다"),
        contact: z.string().regex(/^\+?[1-9]\d{1,14}$/, "올바른 연락처 형식이 아닙니다"),
        region: z.string().optional(),
        job: z.string().optional(),
        motivation: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // 고유한 openId 생성 (SMS 로그인용)
        const openId = `sms_${randomBytes(16).toString("hex")}`;

        // 사용자 생성
        await db.insert(users).values({
          openId,
          name: input.name,
          email: null,
          loginMethod: "sms",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        });

        // 생성된 사용자 조회
        const newUsers = await db
          .select()
          .from(users)
          .where(eq(users.openId, openId))
          .limit(1);

        if (!newUsers || newUsers.length === 0) {
          throw new Error("User creation failed");
        }

        const userId = newUsers[0].id;

        // 사용자 프로필 생성
        await db.insert(userProfiles).values({
          userId,
          phoneNumber: input.contact,
          address: input.region || null,
          city: null,
          zipCode: null,
          avatarUrl: null,
          profileImageUrl: null,
          bio: input.motivation || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          success: true,
          userId,
          message: "회원가입이 완료되었습니다.",
          user: {
            id: userId,
            openId,
            name: input.name,
            email: null,
            role: "user",
            loginMethod: "sms",
          },
        };
      } catch (error) {
        console.error("[Signup Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "회원가입에 실패했습니다. 다시 시도해주세요.",
        });
      }
    }),
});
