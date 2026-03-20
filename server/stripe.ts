import Stripe from 'stripe';
// @ts-ignore
import { TRPCError } from '@trpc/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {});

export async function createCheckoutSession(input: {
  tierId: string;
  tierName: string;
  amount: number;
  userEmail?: string;
  userId?: number;
  origin: string;
}) {
  try {
    const priceMap: Record<string, { name: string; amount: number }> = {
      silver: { name: 'Silver Wellness', amount: 29900 },
      gold: { name: 'Gold Premium', amount: 59900 },
      platinum: { name: 'Platinum Elite', amount: 99900 },
      diamond: { name: 'Diamond Master', amount: 199900 },
    };

    const tierInfo = priceMap[input.tierId];
    if (!tierInfo) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid tier ID',
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'krw',
            product_data: {
              name: tierInfo.name,
              description: `${tierInfo.name} 멤버십 월간 구독`,
              images: [],
            },
            unit_amount: tierInfo.amount,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${input.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.origin}/checkout`,
      customer_email: input.userEmail,
      metadata: {
        userId: input.userId?.toString() || 'guest',
        tierId: input.tierId,
        tierName: tierInfo.name,
      },
      allow_promotion_codes: true,
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create checkout session',
    });
  }
}

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);
      // DB에 구독 정보 저장
      return { success: true };
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id);
      // DB에 구독 상태 업데이트
      return { success: true };
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription deleted:', subscription.id);
      // DB에서 구독 취소 처리
      return { success: true };
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoice.id);
      // 결제 완료 처리
      return { success: true };
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice payment failed:', invoice.id);
      // 결제 실패 처리
      return { success: true };
    }

    default:
      return { success: false, message: 'Unhandled event type' };
  }
}
