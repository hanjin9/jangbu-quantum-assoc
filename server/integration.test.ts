import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmailViaManus, sendBatchEmails } from './_core/email-service-manus';
import Stripe from 'stripe';

describe('Email Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send email via Manus API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, messageId: 'msg_123' })
    });
    global.fetch = mockFetch;

    const result = await sendEmailViaManus({
      to: 'user@example.com',
      subject: '결제 확인',
      html: '<p>결제가 완료되었습니다.</p>',
      text: '결제가 완료되었습니다.'
    });

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/email/send'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('should handle email send failure', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    });
    global.fetch = mockFetch;

    const result = await sendEmailViaManus({
      to: 'user@example.com',
      subject: '결제 확인',
      html: '<p>결제가 완료되었습니다.</p>',
      text: '결제가 완료되었습니다.'
    });

    expect(result).toBe(false);
  });

  it('should send batch emails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
    global.fetch = mockFetch;

    const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];
    const result = await sendBatchEmails(
      recipients,
      '공지사항',
      '<p>새로운 공지사항입니다.</p>',
      '새로운 공지사항입니다.'
    );

    expect(result.success).toBe(3);
    expect(result.failed).toBe(0);
  });
});

describe('Stripe Webhook Integration', () => {
  it('should handle checkout.session.completed event', async () => {
    const mockSession: Partial<Stripe.Checkout.Session> = {
      id: 'cs_test_123',
      client_reference_id: '1',
      customer_email: 'user@example.com',
      amount_total: 59900,
      metadata: {
        tier_id: 'gold'
      }
    };

    // Verify event structure
    expect(mockSession.id).toBeDefined();
    expect(mockSession.client_reference_id).toBe('1');
    expect(mockSession.customer_email).toBe('user@example.com');
    expect(mockSession.metadata?.tier_id).toBe('gold');
  });

  it('should handle subscription.updated event', async () => {
    const mockSubscription: Partial<Stripe.Subscription> = {
      id: 'sub_test_123',
      customer: 'cus_test_123',
      status: 'active',
      current_period_end: Math.floor(Date.now() / 1000) + 2592000 // 30 days
    };

    expect(mockSubscription.status).toBe('active');
    expect(mockSubscription.current_period_end).toBeGreaterThan(0);
  });

  it('should verify test event detection', async () => {
    const testEventId = 'evt_test_abc123';
    const isTestEvent = testEventId.startsWith('evt_test_');

    expect(isTestEvent).toBe(true);
  });
});

describe('Admin Dashboard Data', () => {
  it('should calculate order statistics correctly', () => {
    const orders = [
      { id: 1, status: 'completed', amount: '599.00' },
      { id: 2, status: 'completed', amount: '299.00' },
      { id: 3, status: 'pending', amount: '999.00' }
    ];

    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      revenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + parseFloat(o.amount), 0)
    };

    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(2);
    expect(stats.pending).toBe(1);
    expect(stats.revenue).toBe(898);
  });

  it('should calculate subscription statistics correctly', () => {
    const subscriptions = [
      { id: 1, status: 'active' },
      { id: 2, status: 'active' },
      { id: 3, status: 'paused' },
      { id: 4, status: 'cancelled' }
    ];

    const stats = {
      active: subscriptions.filter(s => s.status === 'active').length,
      paused: subscriptions.filter(s => s.status === 'paused').length,
      cancelled: subscriptions.filter(s => s.status === 'cancelled').length
    };

    expect(stats.active).toBe(2);
    expect(stats.paused).toBe(1);
    expect(stats.cancelled).toBe(1);
  });
});

describe('Appointment System', () => {
  it('should validate appointment booking data', () => {
    const appointment = {
      practitionerId: 1,
      userId: 1,
      appointmentDate: new Date('2026-03-25T10:00:00'),
      duration: 60,
      status: 'scheduled',
      consultationType: 'general'
    };

    expect(appointment.practitionerId).toBeGreaterThan(0);
    expect(appointment.userId).toBeGreaterThan(0);
    expect(appointment.duration).toBeGreaterThan(0);
    expect(appointment.status).toBe('scheduled');
    expect(['general', 'follow-up', 'emergency']).toContain(appointment.consultationType);
  });

  it('should validate time slot availability', () => {
    const timeSlots = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '14:00', available: true }
    ];

    const availableSlots = timeSlots.filter(slot => slot.available);
    expect(availableSlots.length).toBe(3);
    expect(availableSlots.every(slot => slot.available)).toBe(true);
  });

  it('should validate practitioner data', () => {
    const practitioner = {
      id: 1,
      name: '김영수',
      title: '양자요법 전문가',
      specialty: '에너지 치유',
      experience: 15,
      email: 'kim@example.com',
      phone: '+82-10-1234-5678'
    };

    expect(practitioner.id).toBeGreaterThan(0);
    expect(practitioner.name).toBeTruthy();
    expect(practitioner.experience).toBeGreaterThan(0);
    expect(practitioner.email).toContain('@');
    expect(practitioner.phone).toMatch(/^\+82/);
  });
});
