/**
 * Stripe Products and Prices Configuration
 * These are the membership tiers for Jangbu Quantum Therapy Association
 */

export const MEMBERSHIP_TIERS = {
  SILVER: {
    id: 'silver',
    name: 'Silver Wellness',
    description: 'Basic quantum therapy access',
    priceInCents: 29900, // $299/month
    stripePriceId: process.env.STRIPE_PRICE_SILVER || 'price_silver_placeholder',
    features: [
      'Basic quantum therapy sessions',
      'Monthly wellness newsletter',
      'Community access',
      'Email support'
    ],
    color: '#c0c0c0'
  },
  GOLD: {
    id: 'gold',
    name: 'Gold Wellness',
    description: 'Premium quantum therapy with personalized care',
    priceInCents: 59900, // $599/month
    stripePriceId: process.env.STRIPE_PRICE_GOLD || 'price_gold_placeholder',
    features: [
      'All Silver features',
      'Priority quantum therapy sessions',
      'Personalized wellness plan',
      'Monthly 1-on-1 consultation',
      'Priority email support'
    ],
    color: '#ffd700'
  },
  PLATINUM: {
    id: 'platinum',
    name: 'Platinum Elite',
    description: 'Ultimate quantum healing experience',
    priceInCents: 99900, // $999/month
    stripePriceId: process.env.STRIPE_PRICE_PLATINUM || 'price_platinum_placeholder',
    features: [
      'All Gold features',
      'Unlimited quantum therapy sessions',
      'VIP lounge access',
      'Weekly consultation calls',
      'Dedicated wellness manager',
      '24/7 priority support',
      'Exclusive events and workshops'
    ],
    color: '#e5e4e2'
  },
  DIAMOND: {
    id: 'diamond',
    name: 'Diamond Quantum',
    description: 'Exclusive quantum elite membership',
    priceInCents: 199900, // $1999/month
    stripePriceId: process.env.STRIPE_PRICE_DIAMOND || 'price_diamond_placeholder',
    features: [
      'All Platinum features',
      'Exclusive quantum research access',
      'Private therapy sessions',
      'Personalized quantum protocols',
      'Annual wellness retreat',
      'Concierge service',
      'VIP networking events'
    ],
    color: '#b9f2cc'
  }
};

export const ONE_TIME_PRODUCTS = {
  CONSULTATION: {
    id: 'consultation',
    name: 'Initial Quantum Consultation',
    description: '60-minute comprehensive quantum therapy assessment',
    priceInCents: 19900, // $199
    stripePriceId: process.env.STRIPE_PRICE_CONSULTATION || 'price_consultation_placeholder'
  },
  WORKSHOP: {
    id: 'workshop',
    name: 'Quantum Wellness Workshop',
    description: 'Exclusive 3-hour quantum healing workshop',
    priceInCents: 29900, // $299
    stripePriceId: process.env.STRIPE_PRICE_WORKSHOP || 'price_workshop_placeholder'
  }
};

export const getAllMembershipTiers = () => {
  return Object.values(MEMBERSHIP_TIERS);
};

export const getMembershipTierById = (id: string) => {
  return Object.values(MEMBERSHIP_TIERS).find(tier => tier.id === id);
};
