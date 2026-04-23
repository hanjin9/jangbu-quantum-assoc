import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto';

/**
 * 비밀번호 재설정 토큰 생성
 */
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * 토큰 해시화
 */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// 개발용 메모리 저장소 (실제 환경에서는 데이터베이스 사용)
const resetTokens = new Map<string, { email: string; expiresAt: Date }>();

export const passwordResetRouter = router({
  /**
   * 비밀번호 재설정 이메일 발송
   */
  sendResetEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email('유효한 이메일을 입력해주세요.'),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      try {
        // 토큰 생성
        const resetToken = generateResetToken();
        const hashedToken = hashToken(resetToken);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

        // 메모리에 토큰 저장 (실제 환경에서는 데이터베이스)
        resetTokens.set(hashedToken, { email, expiresAt });

        // 실제 환경에서는 이메일 발송
        // await sendPasswordResetEmail(email, resetToken);

        console.log(`[Password Reset] Token generated for ${email}`);
        console.log(`[Password Reset] Reset link: /forgot-password?token=${resetToken}`);

        return {
          success: true,
          message: '비밀번호 재설정 링크를 이메일로 발송했습니다.',
          // 개발용: 토큰 반환 (실제 환경에서는 제거)
          token: resetToken,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '이메일 발송에 실패했습니다.',
        });
      }
    }),

  /**
   * 토큰 검증
   */
  validateToken: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, '토큰이 필요합니다.'),
      })
    )
    .query(async ({ input }) => {
      const { token } = input;
      const hashedToken = hashToken(token);

      // 토큰 확인
      const tokenData = resetTokens.get(hashedToken);

      if (!tokenData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '유효하지 않은 토큰입니다.',
        });
      }

      // 토큰 만료 여부 확인
      if (tokenData.expiresAt < new Date()) {
        resetTokens.delete(hashedToken);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '토큰이 만료되었습니다.',
        });
      }

      return {
        valid: true,
        email: tokenData.email,
      };
    }),

  /**
   * 비밀번호 재설정
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, '토큰이 필요합니다.'),
        newPassword: z
          .string()
          .min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
      })
    )
    .mutation(async ({ input }) => {
      const { token, newPassword } = input;
      const hashedToken = hashToken(token);

      // 토큰 확인
      const tokenData = resetTokens.get(hashedToken);

      if (!tokenData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '유효하지 않은 토큰입니다.',
        });
      }

      // 토큰 만료 여부 확인
      if (tokenData.expiresAt < new Date()) {
        resetTokens.delete(hashedToken);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '토큰이 만료되었습니다. 다시 요청해주세요.',
        });
      }

      try {
        // 실제 환경에서는 데이터베이스에서 사용자를 찾아 비밀번호 업데이트
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // await db.update(users).set({ password: hashedPassword }).where(eq(users.email, tokenData.email));

        // 토큰 삭제
        resetTokens.delete(hashedToken);

        console.log(`[Password Reset] Password updated for ${tokenData.email}`);

        return {
          success: true,
          message: '비밀번호가 성공적으로 변경되었습니다.',
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '비밀번호 변경에 실패했습니다.',
        });
      }
    }),
});

export type PasswordResetRouter = typeof passwordResetRouter;
