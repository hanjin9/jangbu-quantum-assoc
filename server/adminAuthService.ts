import { db } from './db';
import { adminLogs, users } from '@/drizzle/schema';
import { hash, verify } from 'argon2';
import crypto from 'crypto';

export interface AdminAuthResult {
  success: boolean;
  message: string;
  requiresMFA?: boolean;
  mfaToken?: string;
  sessionToken?: string;
}

export interface AdminSession {
  userId: string;
  role: 'admin' | 'manager' | 'director';
  loginTime: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

// 관리자 로그인 시도 제한 (Brute Force Protection)
const loginAttempts = new Map<string, { count: number; timestamp: Date }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15분

/**
 * 관리자 로그인 비밀번호 검증
 */
export async function validateAdminLogin(
  email: string,
  password: string,
  ipAddress: string,
  userAgent: string
): Promise<AdminAuthResult> {
  try {
    // 1. 로그인 시도 제한 확인
    const attempt = loginAttempts.get(email);
    if (attempt && attempt.count >= MAX_LOGIN_ATTEMPTS) {
      const lockoutTime = new Date(attempt.timestamp.getTime() + LOCKOUT_DURATION);
      if (new Date() < lockoutTime) {
        // 감사 로그 기록
        await logAdminActivity('LOGIN_FAILED_LOCKOUT', email, ipAddress, userAgent, {
          reason: 'Too many failed attempts',
        });
        return {
          success: false,
          message: `계정이 잠겨있습니다. ${lockoutTime.toLocaleTimeString('ko-KR')}에 다시 시도해주세요.`,
        };
      }
    }

    // 2. 사용자 조회
    const user = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(eq(users.email, email), eq(users.role, 'admin')),
    });

    if (!user) {
      loginAttempts.set(email, {
        count: (attempt?.count || 0) + 1,
        timestamp: new Date(),
      });
      await logAdminActivity('LOGIN_FAILED_USER_NOT_FOUND', email, ipAddress, userAgent);
      return {
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    // 3. 비밀번호 검증 (Argon2)
    const passwordValid = await verify(user.passwordHash || '', password);
    if (!passwordValid) {
      loginAttempts.set(email, {
        count: (attempt?.count || 0) + 1,
        timestamp: new Date(),
      });
      await logAdminActivity('LOGIN_FAILED_INVALID_PASSWORD', email, ipAddress, userAgent);
      return {
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    // 4. 로그인 시도 초기화
    loginAttempts.delete(email);

    // 5. 2FA 활성화 여부 확인
    if (user.mfaEnabled) {
      const mfaToken = crypto.randomBytes(32).toString('hex');
      // TODO: Redis에 mfaToken 저장 (5분 유효)
      await logAdminActivity('LOGIN_MFA_REQUIRED', email, ipAddress, userAgent);
      return {
        success: false,
        requiresMFA: true,
        mfaToken,
        message: '2단계 인증이 필요합니다.',
      };
    }

    // 6. 세션 생성
    const sessionToken = crypto.randomBytes(32).toString('hex');
    // TODO: Redis에 sessionToken 저장

    // 7. 감사 로그 기록
    await logAdminActivity('LOGIN_SUCCESS', email, ipAddress, userAgent, {
      role: user.role,
    });

    return {
      success: true,
      message: '로그인 성공',
      sessionToken,
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 2FA 코드 검증
 */
export async function validate2FA(
  mfaToken: string,
  code: string,
  email: string,
  ipAddress: string,
  userAgent: string
): Promise<AdminAuthResult> {
  try {
    // TODO: Redis에서 mfaToken 조회 및 검증
    // const storedCode = await redis.get(`mfa:${mfaToken}`);
    // if (storedCode !== code) {
    //   return { success: false, message: '인증 코드가 올바르지 않습니다.' };
    // }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    // TODO: Redis에 sessionToken 저장

    await logAdminActivity('2FA_SUCCESS', email, ipAddress, userAgent);

    return {
      success: true,
      message: '2단계 인증 성공',
      sessionToken,
    };
  } catch (error) {
    console.error('2FA validation error:', error);
    return {
      success: false,
      message: '2단계 인증 처리 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 관리자 활동 로그 기록
 */
export async function logAdminActivity(
  action: string,
  adminEmail: string,
  ipAddress: string,
  userAgent: string,
  metadata?: Record<string, any>
) {
  try {
    // TODO: adminLogs 테이블에 기록
    console.log(`[Admin Log] ${action} - ${adminEmail} from ${ipAddress}`);
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}

/**
 * 비밀번호 해시 생성
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    type: 2, // Argon2id
    memoryCost: 2 ** 16, // 64MB
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * 세션 유효성 검증
 */
export async function validateAdminSession(
  sessionToken: string,
  ipAddress: string
): Promise<{ valid: boolean; userId?: string; role?: string }> {
  try {
    // TODO: Redis에서 sessionToken 조회
    // const session = await redis.get(`session:${sessionToken}`);
    // if (!session) return { valid: false };

    // IP 주소 변경 감지 (추가 보안)
    // if (session.ipAddress !== ipAddress) {
    //   await logAdminActivity('SESSION_IP_MISMATCH', session.email, ipAddress, '');
    //   return { valid: false };
    // }

    return { valid: true };
  } catch (error) {
    console.error('Session validation error:', error);
    return { valid: false };
  }
}

/**
 * 관리자 로그아웃
 */
export async function adminLogout(
  sessionToken: string,
  email: string,
  ipAddress: string,
  userAgent: string
) {
  try {
    // TODO: Redis에서 sessionToken 삭제
    await logAdminActivity('LOGOUT', email, ipAddress, userAgent);
  } catch (error) {
    console.error('Logout error:', error);
  }
}
