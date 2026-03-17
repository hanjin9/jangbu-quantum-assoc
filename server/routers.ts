import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  board: router({
    list: publicProcedure.input(z.object({ category: z.string().optional(), page: z.number().default(1) }).optional()).query(async ({ input }) => ({
      posts: [{ id: 1, title: '2026년 1월 양자요법 자격증 시험 안내', category: 'notice', author: '관리자', views: 234, likes: 45, comments: 12, date: '2026-03-18' }],
      total: 1,
      page: input?.page || 1
    })),
    create: protectedProcedure.input(z.object({ title: z.string().min(5), content: z.string().min(10), category: z.enum(['notice', 'qa', 'free']) })).mutation(async ({ input, ctx }) => ({ id: Math.random(), ...input, userId: ctx.user?.id, createdAt: new Date() }))
  }),
  community: router({
    listGroups: publicProcedure.query(async () => [
      { id: 1, name: 'VIP 라운지', description: '프리미엄 멤버 전용', category: 'vip_lounge', members: 234, icon: '👑' },
      { id: 2, name: '학습 그룹', description: '양자요법 이론 및 실습', category: 'study', members: 567, icon: '📚' },
      { id: 3, name: '경험 공유', description: '실제 치료 경험과 사례', category: 'experience', members: 892, icon: '💡' }
    ]),
    joinGroup: protectedProcedure.input(z.object({ groupId: z.number() })).mutation(async ({ input, ctx }) => ({ success: true, groupId: input.groupId, userId: ctx.user?.id, joinedAt: new Date() }))
  }),
  exam: router({
    listExams: publicProcedure.query(async () => [
      { id: 1, title: '기초 양자요법 이론', level: 'beginner', duration: 60, questions: 20, passingScore: 70 },
      { id: 2, title: '중급 양자에너지 치료', level: 'intermediate', duration: 90, questions: 30, passingScore: 75 },
      { id: 3, title: '고급 양자요법 전문가', level: 'advanced', duration: 120, questions: 40, passingScore: 80 }
    ]),
    startExam: protectedProcedure.input(z.object({ examId: z.number() })).mutation(async ({ input, ctx }) => ({ attemptId: Math.random(), examId: input.examId, userId: ctx.user?.id, startedAt: new Date(), status: 'in_progress' })),
    submitExam: protectedProcedure.input(z.object({ attemptId: z.number(), answers: z.any() })).mutation(async ({ input }) => { const score = Math.random() * 100; return { attemptId: input.attemptId, score: Math.round(score), status: score >= 75 ? 'passed' : 'failed', submittedAt: new Date() }; })
  }),
  certification: router({
    getMyCertifications: protectedProcedure.query(async ({ ctx }) => ({ userId: ctx.user?.id, certifications: [{ id: 1, name: '기초 양자요법 자격증', issueDate: new Date(), certificateNumber: 'CERT-2026-001', status: 'active' }] })),
    issueCertificate: protectedProcedure.input(z.object({ examAttemptId: z.number(), certificationName: z.string() })).mutation(async ({ input, ctx }) => ({ id: Math.random(), userId: ctx.user?.id, certificationName: input.certificationName, certificateNumber: `CERT-${Date.now()}`, issueDate: new Date(), status: 'active', verificationCode: Math.random().toString(36).substring(7) })),
    verifyCertificate: publicProcedure.input(z.object({ certificateNumber: z.string() })).query(async ({ input }) => ({ certificateNumber: input.certificateNumber, isValid: true, certificationName: '기초 양자요법 자격증', issueDate: new Date(), status: 'active' }))
  }),
  sms: router({
    sendSMS: protectedProcedure.input(z.object({ phoneNumber: z.string(), message: z.string(), type: z.enum(['appointment', 'payment', 'reminder', 'alert']) })).mutation(async ({ input }) => ({ success: true, messageId: Math.random().toString(36), phoneNumber: input.phoneNumber, type: input.type, sentAt: new Date(), status: 'sent' })),
    getSMSHistory: protectedProcedure.query(async ({ ctx }) => ({ userId: ctx.user?.id, smsHistory: [{ id: 1, phoneNumber: '010-****-5678', message: '상담 예약이 확정되었습니다.', type: 'appointment', sentAt: new Date(), status: 'delivered' }] })),
    updatePhoneNumber: protectedProcedure.input(z.object({ phoneNumber: z.string() })).mutation(async ({ input, ctx }) => ({ userId: ctx.user?.id, phoneNumber: input.phoneNumber, verified: false, updatedAt: new Date() }))
  })
});

export type AppRouter = typeof appRouter;
