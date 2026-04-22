import { getDb } from "./db";
import { smsVerifications, smsLoginSessions, userProfiles } from "../drizzle/schema";
import { eq, and, gt } from "drizzle-orm";

/**
 * SMS 인증 관련 데이터베이스 헬퍼 함수
 */

/**
 * SMS 인증 코드 저장
 */
export async function saveSmsVerification(
  phoneNumber: string,
  otpCode: string,
  expiresAt: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(smsVerifications).values({
    phoneNumber,
    otpCode,
    isVerified: 0,
    expiresAt,
    attemptCount: 0,
  });
}

/**
 * SMS 인증 코드 검증
 */
export async function verifySmsCode(
  phoneNumber: string,
  otpCode: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const verification = await db
    .select()
    .from(smsVerifications)
    .where(
      and(
        eq(smsVerifications.phoneNumber, phoneNumber),
        eq(smsVerifications.otpCode, otpCode),
        eq(smsVerifications.isVerified, 0),
        gt(smsVerifications.expiresAt, new Date())
      )
    )
    .limit(1);

  if (verification.length === 0) {
    return false;
  }

  // 인증 완료 표시
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  await db2
    .update(smsVerifications)
    .set({ isVerified: 1 })
    .where(eq(smsVerifications.id, verification[0].id));

  return true;
}

/**
 * SMS 인증 시도 횟수 증가
 */
export async function incrementSmsAttempt(phoneNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const verification = await db
    .select()
    .from(smsVerifications)
    .where(
      and(
        eq(smsVerifications.phoneNumber, phoneNumber),
        eq(smsVerifications.isVerified, 0),
        gt(smsVerifications.expiresAt, new Date())
      )
    )
    .orderBy((t: any) => t.createdAt)
    .limit(1);

  if (verification.length > 0) {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    await db2
      .update(smsVerifications)
      .set({ attemptCount: verification[0].attemptCount + 1 })
      .where(eq(smsVerifications.id, verification[0].id));

    return verification[0].attemptCount + 1;
  }

  return 0;
}

/**
 * SMS 로그인 세션 생성
 */
export async function createSmsLoginSession(
  phoneNumber: string,
  sessionToken: string,
  expiresAt: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(smsLoginSessions).values({
    phoneNumber,
    sessionToken,
    isVerified: 0,
    expiresAt,
  });
}

/**
 * SMS 로그인 세션 검증
 */
export async function verifySmsLoginSession(
  sessionToken: string
): Promise<{ phoneNumber: string; userId: number | null } | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const session = await db
    .select()
    .from(smsLoginSessions)
    .where(
      and(
        eq(smsLoginSessions.sessionToken, sessionToken),
        gt(smsLoginSessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (session.length === 0) {
    return null;
  }

  return {
    phoneNumber: session[0].phoneNumber,
    userId: session[0].userId,
  };
}

/**
 * SMS 로그인 세션 완료 (사용자 연결)
 */
export async function completeSmsLoginSession(
  sessionToken: string,
  userId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(smsLoginSessions)
    .set({ userId, isVerified: 1 })
    .where(eq(smsLoginSessions.sessionToken, sessionToken));
}

/**
 * 휴대폰 번호로 사용자 조회
 */
export async function getUserByPhoneNumber(phoneNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const userProfile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.phoneNumber, phoneNumber))
    .limit(1);

  if (userProfile.length === 0) {
    return null;
  }

  return userProfile[0];
}

/**
 * SMS 로그인 세션 정리 (만료된 세션 삭제)
 */
export async function cleanupExpiredSmsLoginSessions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .delete(smsLoginSessions)
    .where(gt(smsLoginSessions.expiresAt, new Date()));
}
