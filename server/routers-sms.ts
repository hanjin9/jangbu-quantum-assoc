import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  generateOTP,
  sendOTPCode,
} from "./_core/twilio";
import {
  saveSmsVerification,
  verifySmsCode,
  incrementSmsAttempt,
  createSmsLoginSession,
  verifySmsLoginSession,
  completeSmsLoginSession,
  getUserByPhoneNumber,
} from "./db-sms";
import { getDb } from "./db";
import { users, userProfiles } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

/**
 * SMS 인증 로그인 라우터
 */
export const smsAuthRouter = router({
  /**
   * 1단계: 휴대폰 번호로 SMS 인증 코드 발송
   */
  sendOTP: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 인증 코드 생성
        const otp = generateOTP();

        // 5분 후 만료
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // 데이터베이스에 저장
        await saveSmsVerification(input.phoneNumber, otp, expiresAt);

        // SMS 발송
        const result = await sendOTPCode(input.phoneNumber, otp);

        if (!result.sid) {
          throw new Error("Failed to send SMS");
        }

        return {
          success: true,
          message: "SMS 인증 코드가 발송되었습니다.",
          expiresIn: 300, // 5분 (초 단위)
        };
      } catch (error) {
        console.error("[SMS OTP Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SMS 발송에 실패했습니다. 다시 시도해주세요.",
        });
      }
    }),

  /**
   * 2단계: SMS 인증 코드 검증 및 로그인 세션 생성
   */
  verifyOTP: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        otpCode: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 인증 시도 횟수 증가
        const attemptCount = await incrementSmsAttempt(input.phoneNumber);

        // 5회 이상 실패 시 차단
        if (attemptCount > 5) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "인증 시도 횟수를 초과했습니다. 5분 후 다시 시도해주세요.",
          });
        }

        // OTP 검증
        const isValid = await verifySmsCode(input.phoneNumber, input.otpCode);

        if (!isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "인증 코드가 올바르지 않습니다.",
          });
        }

        // 로그인 세션 생성
        const sessionToken = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30분

        await createSmsLoginSession(input.phoneNumber, sessionToken, expiresAt);

        return {
          success: true,
          sessionToken,
          message: "인증이 완료되었습니다.",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("[SMS Verify Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "인증 검증에 실패했습니다.",
        });
      }
    }),

  /**
   * 3단계: 로그인 세션으로 사용자 자동 로그인
   */
  loginWithSession: publicProcedure
    .input(
      z.object({
        sessionToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 세션 검증
        const session = await verifySmsLoginSession(input.sessionToken);

        if (!session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "유효하지 않은 세션입니다.",
          });
        }

        // 기존 사용자 조회
        let user: any = await getUserByPhoneNumber(session.phoneNumber);

        if (!user) {
          // 새 사용자 생성
          const db = await getDb();
          if (!db) throw new Error("Database not available");

          // 임시 openId 생성 (SMS 로그인용)
          const tempOpenId = `sms_${session.phoneNumber}_${Date.now()}`;

          // 사용자 생성
          await db.insert(users).values({
            openId: tempOpenId,
            name: `User ${session.phoneNumber}`,
            email: null,
            loginMethod: "sms",
            role: "user",
          });

          // 프로필 생성
          const newUser = await db
            .select()
            .from(users)
            .where(eq(users.openId, tempOpenId))
            .limit(1);

          if (newUser.length > 0) {
            await db.insert(userProfiles).values({
              userId: newUser[0].id,
              phoneNumber: session.phoneNumber,
            });

            user = {
              id: 0,
              userId: newUser[0].id,
              phoneNumber: session.phoneNumber,
              address: null,
              city: null,
              zipCode: null,
              avatarUrl: null,
              profileImageUrl: null,
              bio: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
        }

        // 세션에 사용자 ID 저장
        if (user && "userId" in user) {
          await completeSmsLoginSession(input.sessionToken, user.userId);
        }

        return {
          success: true,
          message: "로그인되었습니다.",
          userId: user?.userId || session.userId,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("[SMS Login Error]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "로그인에 실패했습니다.",
        });
      }
    }),
});
