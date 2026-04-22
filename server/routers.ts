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
  }),
  qrcode: router({
    generateQRCode: protectedProcedure.input(z.object({ certificateNumber: z.string(), certificationName: z.string() })).mutation(async ({ input }) => ({ success: true, qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(input.certificateNumber)}`, certificateNumber: input.certificateNumber, generatedAt: new Date() })),
    verifyCertificateQR: publicProcedure.input(z.object({ qrData: z.string() })).query(async ({ input }) => ({ isValid: true, certificateNumber: input.qrData, certificationName: '양자요법 자격증', issueDate: new Date(), status: 'active' }))
  }),
  livestream: router({
    listLiveStreams: publicProcedure.query(async () => [
      { id: 1, title: '기초 양자요법 이론 라이브', instructor: '김전문가', startTime: new Date(Date.now() + 3600000), duration: 120, viewers: 234, status: 'upcoming' },
      { id: 2, title: '에너지 치유 실습 세션', instructor: '이전문가', startTime: new Date(Date.now() + 7200000), duration: 90, viewers: 156, status: 'upcoming' },
      { id: 3, title: '양자요법 Q&A 라운드', instructor: '박전문가', startTime: new Date(Date.now() - 1800000), duration: 60, viewers: 89, status: 'live' }
    ]),
    joinLiveStream: protectedProcedure.input(z.object({ streamId: z.number() })).mutation(async ({ input, ctx }) => ({ success: true, streamId: input.streamId, userId: ctx.user?.id, joinedAt: new Date(), streamUrl: `https://stream.example.com/live/${input.streamId}` })),
    getStreamHistory: protectedProcedure.query(async ({ ctx }) => ({ userId: ctx.user?.id, history: [{ id: 1, title: '기초 양자요법 이론', instructor: '김전문가', watchedAt: new Date(), duration: 120, completed: true }] }))
  }),
  chatbot: router({
    sendMessage: publicProcedure.input(z.object({ message: z.string(), userId: z.string().optional() })).mutation(async ({ input }) => {
      const responses: Record<string, string> = {
        '가입': '멤버십 가입은 홈페이지의 "멤버십 가입하기" 버튼을 클릭하시면 됩니다. Silver, Gold, Platinum, Diamond 4가지 플랜이 있습니다.',
        '상담': '상담 예약은 "상담 예약하기" 메뉴에서 원하는 날짜와 시간을 선택하시면 됩니다. 전문 관리사가 1:1 상담을 제공합니다.',
        '자격증': '양자요법 자격증은 실기시험에 합격하면 발급됩니다. 시험은 기초, 중급, 고급 3단계로 구성되어 있습니다.',
        '시험': '실기시험은 "실기시험" 메뉴에서 응시할 수 있습니다. 합격선은 75점 이상입니다.',
        '비용': '멤버십 비용은 플랜별로 다릅니다. Silver는 월 29,900원, Gold는 49,900원, Platinum은 79,900원, Diamond는 무제한입니다.'
      };
      const response = Object.entries(responses).find(([key]) => input.message.includes(key))?.[1] || '안녕하세요! 양자요법 관리사 협회입니다. 궁금한 점이 있으시면 "가입", "상담", "자격증", "시험", "비용" 등을 입력해주세요.';
      return { success: true, message: response, timestamp: new Date(), conversationId: Math.random().toString(36) };
    }),
    getChatHistory: protectedProcedure.query(async ({ ctx }) => ({ userId: ctx.user?.id, messages: [{ id: 1, role: 'user', content: '가입하고 싶어요', timestamp: new Date() }, { id: 2, role: 'bot', content: '멤버십 가입은...', timestamp: new Date() }] }))
  }),
  livestreamChat: router({
    sendMessage: protectedProcedure.input(z.object({ streamId: z.number(), message: z.string().min(1).max(500) })).mutation(async ({ input, ctx }) => ({
      success: true,
      messageId: Math.random(),
      streamId: input.streamId,
      userId: ctx.user?.id,
      userName: ctx.user?.name || 'Anonymous',
      message: input.message,
      isInstructorReply: false,
      createdAt: new Date()
    })),
    getMessages: publicProcedure.input(z.object({ streamId: z.number(), limit: z.number().default(50) })).query(async ({ input }) => ({
      streamId: input.streamId,
      messages: [
        { id: 1, streamId: input.streamId, userId: 1, userName: '김민지', message: '기초 이론이 정말 도움이 됩니다!', isInstructorReply: false, createdAt: new Date(Date.now() - 60000) },
        { id: 2, streamId: input.streamId, userId: 2, userName: '강사님', message: '감사합니다! 더 궁금한 점이 있으시면 언제든 질문해주세요.', isInstructorReply: true, createdAt: new Date(Date.now() - 50000) },
        { id: 3, streamId: input.streamId, userId: 3, userName: '이준호', message: '실습은 어떻게 하나요?', isInstructorReply: false, createdAt: new Date(Date.now() - 30000) }
      ]
    })),
    replyToMessage: protectedProcedure.input(z.object({ streamId: z.number(), messageId: z.number(), replyMessage: z.string().min(1).max(500) })).mutation(async ({ input, ctx }) => ({
      success: true,
      replyId: Math.random(),
      streamId: input.streamId,
      replyToMessageId: input.messageId,
      userId: ctx.user?.id,
      userName: ctx.user?.name || 'Instructor',
      message: input.replyMessage,
      isInstructorReply: ctx.user?.role === 'admin',
      createdAt: new Date()
    }))
  }),
  profile: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => ({
      id: ctx.user?.id,
      name: ctx.user?.name,
      email: ctx.user?.email,
      phoneNumber: '',
      address: '',
      city: '',
      zipCode: '',
      avatarUrl: '',
      profileImageUrl: '',
      bio: ''
    })),
    updateProfile: protectedProcedure.input(z.object({
      name: z.string().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      zipCode: z.string().optional(),
      avatarUrl: z.string().optional(),
      bio: z.string().optional()
    })).mutation(async ({ input, ctx }) => ({
      success: true,
      userId: ctx.user?.id,
      message: '프로필이 업데이트되었습니다',
      updatedAt: new Date()
    })),
    uploadAvatar: protectedProcedure.input(z.object({
      fileName: z.string(),
      fileSize: z.number()
    })).mutation(async ({ input, ctx }) => ({
      success: true,
      userId: ctx.user?.id,
      fileName: input.fileName,
      fileSize: input.fileSize,
      url: `https://cdn.example.com/avatars/${ctx.user?.id}/${input.fileName}`,
      uploadedAt: new Date()
    }))
  }),
  socialAuth: router({
    kakaoLogin: publicProcedure.input(z.object({ kakaoCode: z.string() })).mutation(async ({ input }) => ({
      success: true,
      userId: Math.random(),
      token: `token_${Math.random().toString(36).substring(7)}`,
      message: '카카오 로그인 성공'
    })),
    naverLogin: publicProcedure.input(z.object({ naverCode: z.string() })).mutation(async ({ input }) => ({
      success: true,
      userId: Math.random(),
      token: `token_${Math.random().toString(36).substring(7)}`,
      message: '네이버 로그인 성공'
    })),
    phoneLogin: publicProcedure.input(z.object({ phoneNumber: z.string(), verificationCode: z.string() })).mutation(async ({ input }) => ({
      success: true,
      userId: Math.random(),
      token: `token_${Math.random().toString(36).substring(7)}`,
      message: '휴대폰 로그인 성공'
    })),
    sendPhoneVerification: publicProcedure.input(z.object({ phoneNumber: z.string() })).mutation(async ({ input }) => ({
      success: true,
      verificationId: Math.random().toString(36).substring(7),
      message: '인증번호가 발송되었습니다 (테스트: 123456)'
    }))
  }),
  admin: router({
    listSubscriptions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('관리자만 접근 가능합니다');
      return {
        subscriptions: [
          { id: 1, userId: 2, userName: '김민지', email: 'kim@example.com', tierId: 'gold', status: 'active', amount: 49.99, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
          { id: 2, userId: 3, userName: '이준호', email: 'lee@example.com', tierId: 'silver', status: 'active', amount: 29.99, currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        ]
      };
    }),
    cancelSubscription: protectedProcedure.input(z.object({ subscriptionId: z.number(), userId: z.number(), reason: z.string(), refundAmount: z.number().optional() })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('관리자만 접근 가능합니다');
      return {
        success: true,
        subscriptionId: input.subscriptionId,
        userId: input.userId,
        reason: input.reason,
        refundAmount: input.refundAmount || 0,
        status: 'cancelled',
        cancelledAt: new Date(),
        message: '구독이 취소되었습니다'
      };
    }),
    processRefund: protectedProcedure.input(z.object({ subscriptionId: z.number(), userId: z.number(), orderId: z.number(), amount: z.number(), reason: z.string(), notes: z.string().optional() })).mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('관리자만 접근 가능합니다');
      return {
        success: true,
        refundId: Math.random(),
        orderId: input.orderId,
        userId: input.userId,
        amount: input.amount,
        reason: input.reason,
        status: 'succeeded',
        stripeRefundId: `re_${Math.random().toString(36).substring(7)}`,
        processedAt: new Date(),
        message: '환불이 처리되었습니다'
      };
    }),
    getRefundHistory: protectedProcedure.input(z.object({ userId: z.number().optional() })).query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') throw new Error('관리자만 접근 가능합니다');
      return {
        refunds: [
          { id: 1, userId: 2, orderId: 5, amount: 49.99, reason: '사용자 요청', status: 'succeeded', processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { id: 2, userId: 3, orderId: 6, amount: 29.99, reason: '서비스 불만족', status: 'succeeded', processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
        ]
      };
    })
  }),
  certificates: router({
    issueCertificateAfterPayment: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        courseId: z.string(),
        courseName: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('User not authenticated');
        
        const { issueCertificateAfterPayment } = await import('./certificateService');
        const result = await issueCertificateAfterPayment(
          ctx.user.id,
          input.orderId,
          input.courseId,
          input.courseName,
          ctx.user.name || 'User'
        );
        
        return {
          success: true,
          certificate: {
            id: result.certificate.id,
            certificateNumber: result.certificate.certificateNumber,
            verificationCode: result.certificate.verificationCode,
            courseName: result.certificate.courseName,
            issueDate: result.certificate.issueDate,
          },
          pdfUrl: result.pdfUrl,
        };
      }),
    getUserCertificates: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new Error('User not authenticated');
        
        const { getUserCertificatesList } = await import('./certificateService');
        const certs = await getUserCertificatesList(ctx.user.id);
        
        return {
          certificates: certs.map(c => ({
            id: c.id,
            certificateNumber: c.certificateNumber,
            courseName: c.courseName,
            issueDate: c.issueDate,
            expiryDate: c.expiryDate,
            pdfUrl: c.certificatePdfUrl,
            status: c.status,
          })),
        };
      }),
    verifyCertificate: publicProcedure
      .input(z.object({
        certificateNumber: z.string(),
      }))
      .query(async ({ input }) => {
        const { verifyCertificateByNumber } = await import('./certificateService');
        const cert = await verifyCertificateByNumber(input.certificateNumber);
        
        if (!cert) {
          return {
            isValid: false,
            message: 'Certificate not found',
          };
        }
        
        return {
          isValid: cert.status === 'active',
          certificateNumber: cert.certificateNumber,
          courseName: cert.courseName,
          issueDate: cert.issueDate,
          status: cert.status,
        };
      }),
    downloadCertificate: protectedProcedure
      .input(z.object({
        certificateId: z.number(),
      }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('User not authenticated');
        
        const { getCertificateById } = await import('./certificateService');
        const cert = await getCertificateById(input.certificateId);
        
        if (!cert || cert.userId !== ctx.user.id) {
          throw new Error('Certificate not found or unauthorized');
        }
        
        return {
          success: true,
          pdfUrl: cert.certificatePdfUrl,
          certificateNumber: cert.certificateNumber,
          downloadUrl: cert.certificatePdfUrl,
        };
      }),
    revokeCertificate: protectedProcedure
      .input(z.object({
        certificateId: z.number(),
        reason: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Admin access required');
        
        const { revokeCertificateById } = await import('./certificateService');
        await revokeCertificateById(input.certificateId, input.reason);
        
        return {
          success: true,
          message: 'Certificate revoked successfully',
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;