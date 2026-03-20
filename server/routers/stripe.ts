import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import Stripe from 'stripe';
import { handleStripeWebhook, sendCertificateEmail } from '../webhooks/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
});

export const stripeRouter = router({
  /**
   * 결제 세션 생성
   */
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        tierId: z.string(),
        tierName: z.string(),
        amount: z.number(),
        userEmail: z.string().email(),
        userName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'krw',
                product_data: {
                  name: `${input.tierName} 멤버십`,
                  description: '양자요법 관리사 협회 멤버십',
                },
                unit_amount: input.amount,
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          customer_email: input.userEmail,
          client_reference_id: input.userName,
          metadata: {
            tier_id: input.tierId,
            tier_name: input.tierName,
            user_email: input.userEmail,
            user_name: input.userName,
          },
          success_url: `${process.env.FRONTEND_URL || 'https://jangbuqntm-zfmcugcm.manus.space'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL || 'https://jangbuqntm-zfmcugcm.manus.space'}/checkout/cancel`,
        });

        return {
          sessionId: session.id,
          checkoutUrl: session.url,
        };
      } catch (error) {
        console.error('[Stripe Error]', error);
        throw new Error('결제 세션 생성 실패');
      }
    }),

  /**
   * 웹훅 이벤트 처리
   */
  handleWebhook: publicProcedure
    .input(
      z.object({
        event: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await handleStripeWebhook(input.event);
        return { success: true };
      } catch (error) {
        console.error('[Webhook Error]', error);
        throw new Error('웹훅 처리 실패');
      }
    }),

  /**
   * 결제 이력 조회
   */
  getPaymentHistory: publicProcedure.query(async () => {
    try {
      // TODO: 현재 사용자의 결제 이력을 DB에서 조회
      return [];
    } catch (error) {
      console.error('[Payment History Error]', error);
      throw new Error('결제 이력 조회 실패');
    }
  }),

  /**
   * 현재 구독 정보 조회
   */
  getCurrentSubscription: publicProcedure.query(async () => {
    try {
      // TODO: 현재 사용자의 구독 정보를 DB에서 조회
      return null;
    } catch (error) {
      console.error('[Subscription Error]', error);
      throw new Error('구독 정보 조회 실패');
    }
  }),

  /**
   * 구독 취소
   */
  cancelSubscription: publicProcedure
    .input(
      z.object({
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // TODO: 현재 사용자의 구독을 취소
        return { success: true };
      } catch (error) {
        console.error('[Cancel Subscription Error]', error);
        throw new Error('구독 취소 실패');
      }
    }),

  /**
   * 수료증 이메일 발송
   */
  sendCertificateEmail: publicProcedure
    .input(
      z.object({
        userEmail: z.string().email(),
        userName: z.string(),
        courseName: z.string(),
        certificateId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const success = await sendCertificateEmail(input);
        return { success };
      } catch (error) {
        console.error('[Certificate Email Error]', error);
        throw new Error('수료증 이메일 발송 실패');
      }
    }),
});
