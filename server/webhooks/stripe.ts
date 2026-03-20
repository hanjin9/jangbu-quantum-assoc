import Stripe from 'stripe';
import { sendEmail, getPaymentEmailTemplate, getRefundEmailTemplate, getSubscriptionCancelEmailTemplate, getCertificateEmailTemplate } from '../emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any,
});

/**
 * Stripe 웹훅 이벤트 처리
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  console.log(`[Stripe Webhook] Event type: ${event.type}`);

  try {
    switch (event.type) {
      // 결제 완료
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      // 결제 실패
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      // 구독 생성
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      // 구독 업데이트
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      // 구독 취소
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // 환불
      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      // 인보이스 결제 완료
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Stripe Webhook Error]', error);
    throw error;
  }
}

/**
 * 결제 완료 처리
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Payment Succeeded] ID: ${paymentIntent.id}`);

  const metadata = paymentIntent.metadata;
  const userId = metadata?.user_id;
  const customerEmail = metadata?.customer_email;
  const customerName = metadata?.customer_name || '회원';
  const tierName = metadata?.tier_name || 'Premium';
  const amount = (paymentIntent.amount / 100).toLocaleString('ko-KR', {
    style: 'currency',
    currency: paymentIntent.currency.toUpperCase(),
  });

  // TODO: DB에 결제 정보 저장
  // await db.payments.create({
  //   userId,
  //   stripePaymentIntentId: paymentIntent.id,
  //   amount: paymentIntent.amount,
  //   currency: paymentIntent.currency,
  //   status: 'completed',
  //   metadata,
  // });

  // 이메일 발송
  if (customerEmail) {
    const emailHtml = getPaymentEmailTemplate({
      userName: customerName,
      tierName,
      amount,
      date: new Date(paymentIntent.created * 1000).toLocaleDateString('ko-KR'),
      transactionId: paymentIntent.id,
    });

    await sendEmail({
      to: customerEmail,
      subject: `[장•부] 결제 완료 안내 - ${tierName} 멤버십`,
      html: emailHtml,
      type: 'payment',
    });
  }
}

/**
 * 결제 실패 처리
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Payment Failed] ID: ${paymentIntent.id}`);

  const metadata = paymentIntent.metadata;
  const customerEmail = metadata?.customer_email;
  const customerName = metadata?.customer_name || '회원';

  // TODO: DB에 실패 정보 저장

  // 이메일 발송
  if (customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: '[장•부] 결제 실패 안내',
      html: `
        <h2>결제 실패</h2>
        <p>${customerName}님, 결제 처리 중 오류가 발생했습니다.</p>
        <p>다시 시도해주세요. 문제가 계속되면 고객 지원팀에 연락해주세요.</p>
      `,
      type: 'payment',
    });
  }
}

/**
 * 구독 생성 처리
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`[Subscription Created] ID: ${subscription.id}`);

  // TODO: DB에 구독 정보 저장
  // await db.subscriptions.create({
  //   stripeSubscriptionId: subscription.id,
  //   customerId: subscription.customer,
  //   status: subscription.status,
  //   currentPeriodStart: new Date(subscription.current_period_start * 1000),
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // });
}

/**
 * 구독 업데이트 처리
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`[Subscription Updated] ID: ${subscription.id}`);

  // TODO: DB에 구독 정보 업데이트
}

/**
 * 구독 취소 처리
 */
async function handleSubscriptionDeleted(subscription: any) {
  console.log(`[Subscription Deleted] ID: ${subscription.id}`);

  // 고객 정보 조회
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const customerEmail = (customer as Stripe.Customer).email;
  const customerName = (customer as Stripe.Customer).name || '회원';

  // TODO: DB에서 구독 정보 업데이트
  // await db.subscriptions.update(
  //   { stripeSubscriptionId: subscription.id },
  //   { status: 'cancelled', cancelledAt: new Date() }
  // );

  // 이메일 발송
  if (customerEmail) {
    const emailHtml = getSubscriptionCancelEmailTemplate({
      userName: customerName,
      tierName: 'Premium',
      cancellationDate: new Date().toLocaleDateString('ko-KR'),
      accessEndDate: new Date(((subscription as any).current_period_end || 0) * 1000).toLocaleDateString('ko-KR'),
    });

    await sendEmail({
      to: customerEmail,
      subject: '[장•부] 구독 취소 안내',
      html: emailHtml,
      type: 'subscription_cancel',
    });
  }
}

/**
 * 환불 처리
 */
async function handleRefund(charge: Stripe.Charge) {
  console.log(`[Refund] Charge ID: ${charge.id}`);

  if (!charge.refunded) return;

  // 고객 정보 조회
  const customer = await stripe.customers.retrieve(charge.customer as string);
  const customerEmail = (customer as Stripe.Customer).email;
  const customerName = (customer as Stripe.Customer).name || '회원';

  // TODO: DB에 환불 정보 저장

  // 이메일 발송
  if (customerEmail) {
    const emailHtml = getRefundEmailTemplate({
      userName: customerName,
      tierName: 'Premium',
      amount: (charge.amount / 100).toLocaleString('ko-KR', {
        style: 'currency',
        currency: charge.currency.toUpperCase(),
      }),
      reason: charge.description || '환불 요청',
      date: new Date().toLocaleDateString('ko-KR'),
      transactionId: charge.id,
    });

    await sendEmail({
      to: customerEmail,
      subject: '[장•부] 환불 완료 안내',
      html: emailHtml,
      type: 'refund',
    });
  }
}

/**
 * 인보이스 결제 완료 처리
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`[Invoice Paid] ID: ${invoice.id}`);

  // 고객 정보 조회
  const customer = await stripe.customers.retrieve(invoice.customer as string);
  const customerEmail = (customer as Stripe.Customer).email;
  const customerName = (customer as Stripe.Customer).name || '회원';

  // TODO: DB에 인보이스 정보 저장

  // 이메일 발송
  if (customerEmail && invoice.lines.data.length > 0) {
    const item = invoice.lines.data[0];
    const amount = (invoice.total / 100).toLocaleString('ko-KR', {
      style: 'currency',
      currency: invoice.currency.toUpperCase(),
    });

    const emailHtml = getPaymentEmailTemplate({
      userName: customerName,
      tierName: item.description || 'Premium',
      amount,
      date: new Date(invoice.created * 1000).toLocaleDateString('ko-KR'),
      transactionId: invoice.id,
    });

    await sendEmail({
      to: customerEmail,
      subject: '[장•부] 정기 결제 완료 안내',
      html: emailHtml,
      type: 'payment',
    });
  }
}

/**
 * 수료증 발급 이메일 발송 (외부에서 호출)
 */
export async function sendCertificateEmail(data: {
  userEmail: string;
  userName: string;
  courseName: string;
  certificateId: string;
}): Promise<boolean> {
  const emailHtml = getCertificateEmailTemplate({
    userName: data.userName,
    courseName: data.courseName,
    certificateId: data.certificateId,
    issuedDate: new Date().toLocaleDateString('ko-KR'),
  });

  return await sendEmail({
    to: data.userEmail,
    subject: `[장•부] 수료증 발급 안내 - ${data.courseName}`,
    html: emailHtml,
    type: 'certificate',
  });
}
