import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { 
  handleCheckoutSessionCompleted, 
  handleSubscriptionUpdated, 
  handleSubscriptionDeleted,
  handleSubscriptionRenewal 
} from '../_core/stripe-handler';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected');
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Fetch customer email
        let userEmail = session.customer_email || '';
        let userName = '';
        
        if (session.customer && typeof session.customer === 'string') {
          try {
            const customer = await stripe.customers.retrieve(session.customer);
            if (customer && !customer.deleted) {
              userEmail = customer.email || userEmail;
              userName = customer.name || '';
            }
          } catch (error) {
            console.error('Error fetching customer:', error);
          }
        }

        await handleCheckoutSessionCompleted(session, userEmail, userName);
        console.log(`✓ Checkout session completed: ${session.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        console.log(`✓ Subscription updated: ${subscription.id}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        console.log(`✓ Subscription deleted: ${subscription.id}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Check if this is a subscription renewal
        if ((invoice as any).subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
            
            // Fetch customer email
            let userEmail = '';
            let userName = '';
            
            if (subscription.customer && typeof subscription.customer === 'string') {
              const customer = await stripe.customers.retrieve(subscription.customer);
              if (customer && !customer.deleted) {
                userEmail = customer.email || '';
                userName = customer.name || '';
              }
            }

            // Send renewal reminder if this is not the first invoice
            if (invoice.number && parseInt(invoice.number) > 1) {
              await handleSubscriptionRenewal(subscription, userEmail, userName);
            }
          } catch (error) {
            console.error('Error processing invoice:', error);
          }
        }
        
        console.log(`✓ Invoice paid: ${invoice.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`⚠️ Invoice payment failed: ${invoice.id}`);
        
        // TODO: Send payment failure notification email
        break;
      }

      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        console.log(`✓ Customer created: ${customer.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
