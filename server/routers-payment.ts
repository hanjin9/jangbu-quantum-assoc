import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
// Stripe 인스턴스 생성 (기본 버전 사용)

/**
 * 결제 프로세스 최소화 라우터
 */
export const paymentRouter = router({
  /**
   * 사용자의 저장된 카드 목록 조회
   */
  getSavedCards: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user?.stripeCustomerId) {
        return { cards: [], hasCards: false };
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: ctx.user.stripeCustomerId,
        type: "card",
      });

      const cards = paymentMethods.data.map((pm) => ({
        id: pm.id,
        brand: pm.card?.brand || "unknown",
        last4: pm.card?.last4 || "****",
        expMonth: pm.card?.exp_month || 0,
        expYear: pm.card?.exp_year || 0,
        isDefault: pm.id === paymentMethods.data[0]?.id,
      }));

      return {
        cards,
        hasCards: cards.length > 0,
      };
    } catch (error) {
      console.error("[Payment] Error fetching cards:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "카드 목록을 불러올 수 없습니다.",
      });
    }
  }),

  /**
   * 저장된 카드로 1클릭 결제
   */
  payWithSavedCard: protectedProcedure
    .input(
      z.object({
        paymentMethodId: z.string(),
        tierId: z.string(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user?.stripeCustomerId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "결제 정보가 없습니다. 다시 로그인해주세요.",
          });
        }

        // 결제 의도 생성
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(input.amount * 100), // 센트 단위로 변환
          currency: input.currency.toLowerCase(),
          customer: ctx.user.stripeCustomerId,
          payment_method: input.paymentMethodId,
          off_session: true,
          confirm: true,
          metadata: {
            userId: ctx.user.id.toString(),
            tierId: input.tierId,
            userName: ctx.user.name || "Unknown",
            userEmail: ctx.user.email || "unknown@example.com",
          },
        });

        if (paymentIntent.status === "succeeded") {
          return {
            success: true,
            paymentIntentId: paymentIntent.id,
            status: "completed",
            message: "결제가 완료되었습니다.",
          };
        } else if (paymentIntent.status === "requires_action") {
          return {
            success: false,
            paymentIntentId: paymentIntent.id,
            status: "requires_action",
            clientSecret: paymentIntent.client_secret,
            message: "추가 인증이 필요합니다.",
          };
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "결제 처리 중 오류가 발생했습니다.",
          });
        }
      } catch (error: any) {
        console.error("[Payment] Error processing payment:", error);

        if (error.code === "card_declined") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "카드가 거절되었습니다. 다른 카드를 사용해주세요.",
          });
        } else if (error.code === "insufficient_funds") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "잔액이 부족합니다.",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "결제 처리에 실패했습니다.",
        });
      }
    }),

  /**
   * 새 카드 추가 및 결제 (저장된 카드가 없을 때)
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        tierId: z.string(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const origin = ctx.req.headers.origin || "https://example.com";

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: input.currency.toLowerCase(),
                product_data: {
                  name: `Tier: ${input.tierId}`,
                  description: `Membership tier upgrade`,
                },
                unit_amount: Math.round(input.amount * 100),
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout`,
          customer_email: ctx.user?.email || undefined,
          ...(ctx.user?.stripeCustomerId && { customer: ctx.user.stripeCustomerId }),
          client_reference_id: ctx.user?.id?.toString() || undefined,
          metadata: {
            userId: ctx.user?.id.toString(),
            tierId: input.tierId,
            userName: ctx.user?.name || "Unknown",
          },
        });

        return {
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error: any) {
        console.error("[Payment] Error creating checkout session:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "결제 세션 생성에 실패했습니다.",
        });
      }
    }),

  /**
   * 결제 의도 확인 (추가 인증 필요 시)
   */
  confirmPaymentIntent: publicProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
        clientSecret: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          input.paymentIntentId
        );

        if (paymentIntent.status === "succeeded") {
          return {
            success: true,
            status: "completed",
            message: "결제가 완료되었습니다.",
          };
        } else if (paymentIntent.status === "requires_action") {
          return {
            success: false,
            status: "requires_action",
            message: "추가 인증이 필요합니다.",
          };
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "결제 상태를 확인할 수 없습니다.",
          });
        }
      } catch (error: any) {
        console.error("[Payment] Error confirming payment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "결제 확인에 실패했습니다.",
        });
      }
    }),

  /**
   * 기본 결제 수단 설정
   */
  setDefaultPaymentMethod: protectedProcedure
    .input(
      z.object({
        paymentMethodId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user?.stripeCustomerId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "결제 정보가 없습니다.",
          });
        }

        await stripe.customers.update(ctx.user.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: input.paymentMethodId,
          },
        });

        return {
          success: true,
          message: "기본 결제 수단이 설정되었습니다.",
        };
      } catch (error: any) {
        console.error("[Payment] Error setting default payment method:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "기본 결제 수단 설정에 실패했습니다.",
        });
      }
    }),
});
