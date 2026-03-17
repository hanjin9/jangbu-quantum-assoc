import Stripe from 'stripe';
import { sendEmail, generatePaymentConfirmationEmail, generateWelcomeEmail, generateSubscriptionRenewalEmail } from './email-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function createCheckoutSession(
  userId: number,
  tierId: string,
  userEmail: string,
  userName: string,
  origin: string
) {
  const tierPrices: Record<string, { name: string; price: number }> = {
    silver: { name: 'Silver Wellness', price: 29900 },
    gold: { name: 'Gold Wellness', price: 59900 },
    platinum: { name: 'Platinum Elite', price: 99900 },
    diamond: { name: 'Diamond Quantum', price: 199900 }
  };

  const tier = tierPrices[tierId];
  if (!tier) throw new Error('Invalid tier');

  // Get or create Stripe customer
  let stripeCustomerId = '';
  
  // TODO: Fetch existing Stripe customer ID from database

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
      metadata: { user_id: userId.toString() }
    });
    stripeCustomerId = customer.id;

    // TODO: Update user with Stripe customer ID in database
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: tier.name,
            description: `${tier.name} Membership - 월간 구독`
          },
          unit_amount: tier.price,
          recurring: {
            interval: 'month',
            interval_count: 1
          }
        },
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      tier_id: tierId,
      customer_email: userEmail
    }
  });

  return session;
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  userEmail: string,
  userName: string
) {
  const userId = parseInt(session.client_reference_id || '0');
  const tierId = (session.metadata?.tier_id as string) || 'gold';

  if (!userId) return;

  try {
    const tierNames: Record<string, string> = {
      silver: 'Silver Wellness',
      gold: 'Gold Wellness',
      platinum: 'Platinum Elite',
      diamond: 'Diamond Quantum'
    };

    const tierName = tierNames[tierId] || tierId;
    const amount = ((session.amount_total || 0) / 100).toFixed(2);
    const date = new Date().toLocaleDateString('ko-KR');

    // TODO: Create order record in database
    console.log(`✓ Order created for user ${userId}`);

    // TODO: Create subscription record in database
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      console.log(`✓ Subscription created: ${subscription.id}`);
    }

    // Send payment confirmation email
    const paymentTemplate = generatePaymentConfirmationEmail({
      orderId: userId,
      tierName,
      amount: `$${amount}`,
      date,
      invoiceUrl: `https://jangbu-assoc.com/invoices/${session.id}`
    });

    await sendEmail(userEmail, paymentTemplate, 'payment_confirmation', userId);

    // Send welcome email for new members
    const welcomeTemplate = generateWelcomeEmail(userName);
    await sendEmail(userEmail, welcomeTemplate, 'welcome', userId);

    console.log(`✓ Order and subscription created for user ${userId}`);
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // TODO: Update subscription record in database
    console.log(`✓ Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // TODO: Update subscription status to cancelled in database
    console.log(`✓ Subscription cancelled: ${subscription.id}`);
  } catch (error) {
    console.error('Error cancelling subscription:', error);
  }
}

export async function handleSubscriptionRenewal(
  subscription: Stripe.Subscription,
  userEmail: string,
  userName: string
) {
  try {
    const tierNames: Record<string, string> = {
      silver: 'Silver Wellness',
      gold: 'Gold Wellness',
      platinum: 'Platinum Elite',
      diamond: 'Diamond Quantum'
    };

    const metadata = subscription.metadata as any;
    const tierId = metadata?.tier_id || 'gold';
    const tierName = tierNames[tierId] || tierId;
    
    const renewalDate = new Date((subscription as any).current_period_end * 1000).toLocaleDateString('ko-KR');
    
    // Get subscription amount from invoice
    const invoices = await stripe.invoices.list({
      subscription: subscription.id,
      limit: 1
    });

    const amount = invoices.data[0] ? `$${(invoices.data[0].amount_paid / 100).toFixed(2)}` : '$0.00';

    // Send renewal reminder email
    const renewalTemplate = generateSubscriptionRenewalEmail({
      tierId,
      tierName,
      renewalDate,
      amount
    });

    const userId = parseInt(metadata?.user_id || '0');
    await sendEmail(userEmail, renewalTemplate, 'subscription_renewal', userId);

    console.log(`✓ Renewal reminder sent for subscription ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription renewal:', error);
  }
}

export async function getUserSubscription(userId: number) {
  try {
    // TODO: Fetch subscription from database
    console.log(`Fetching subscription for user ${userId}`);
    return null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function getUserOrders(userId: number) {
  try {
    // TODO: Fetch orders from database
    console.log(`Fetching orders for user ${userId}`);
    return [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
