/**
 * 자동 결제 청구 시스템
 * - 월간 정기 결제 자동화
 * - 결제 실패 시 재시도 로직
 * - 결제 이력 추적
 */

export interface BillingRecord {
  id: number;
  userId: number;
  stripeCustomerId: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  lastBillingDate?: Date;
  status: 'active' | 'suspended' | 'cancelled';
  retryCount: number;
  lastRetryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingAttempt {
  id: number;
  billingRecordId: number;
  attemptNumber: number;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  stripePaymentIntentId?: string;
  errorMessage?: string;
  attemptedAt: Date;
  nextRetryDate?: Date;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_INTERVAL_DAYS = 3; // 3일마다 재시도

/**
 * 월간 정기 결제 처리
 */
export async function processMonthlyBilling() {
  console.log('[Billing] Starting monthly billing process');

  try {
    // 1. 결제 대상 사용자 조회 (nextBillingDate <= 오늘)
    const billingRecords = await getBillingRecordsDueToday();

    console.log(`[Billing] Found ${billingRecords.length} billing records to process`);

    // 2. 각 사용자별 결제 처리
    for (const record of billingRecords) {
      await processBillingRecord(record);
    }

    // 3. 재시도 대상 결제 처리
    await processFailedBillingRetries();

    console.log('[Billing] Monthly billing process completed');
  } catch (error) {
    console.error('[Billing] Monthly billing process failed:', error);
  }
}

/**
 * 결제 대상 조회
 */
async function getBillingRecordsDueToday(): Promise<BillingRecord[]> {
  // 실제 구현에서는 DB에서 조회
  return [
    {
      id: 1,
      userId: 1,
      stripeCustomerId: 'cus_123456',
      amount: 99000,
      currency: 'KRW',
      billingCycle: 'monthly',
      nextBillingDate: new Date(),
      lastBillingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      retryCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

/**
 * 개별 결제 기록 처리
 */
async function processBillingRecord(record: BillingRecord) {
  try {
    console.log(`[Billing] Processing billing for user ${record.userId}`);

    // 1. Stripe 결제 시도
    const paymentResult = await attemptPayment(record);

    if (paymentResult.success) {
      // 결제 성공
      console.log(`[Billing] Payment successful for user ${record.userId}`);

      // DB 업데이트
      const transactionId = paymentResult.transactionId || 'txn_unknown';
      await updateBillingRecordSuccess(record.id, transactionId);

      // 결제 완료 이메일 발송
      await sendBillingSuccessEmail(record.userId, record.amount);
    } else {
      // 결제 실패
      const errorMsg = paymentResult.error || 'Unknown error';
      console.log(`[Billing] Payment failed for user ${record.userId}: ${errorMsg}`);

      // 재시도 스케줄 설정
      await scheduleBillingRetry(record.id, errorMsg);

      // 결제 실패 알림 발송
      await sendBillingFailureNotification(record.userId, errorMsg);
    }
  } catch (error) {
    console.error(`[Billing] Error processing billing for user ${record.userId}:`, error);
  }
}

/**
 * Stripe 결제 시도
 */
async function attemptPayment(
  record: BillingRecord
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // 실제 구현에서는 Stripe API 호출
    console.log(`[Billing] Attempting payment for customer ${record.stripeCustomerId}`);

    // 시뮬레이션: 90% 성공률
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
      };
    } else {
      return {
        success: false,
        error: 'Card declined',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 결제 성공 시 DB 업데이트
 */
async function updateBillingRecordSuccess(billingRecordId: number, transactionId: string) {
  console.log(`[Billing] Updating billing record ${billingRecordId} with transaction ${transactionId}`);

  // DB 업데이트 로직
  // UPDATE billing_records SET
  //   lastBillingDate = NOW(),
  //   nextBillingDate = DATE_ADD(NOW(), INTERVAL 1 MONTH),
  //   retryCount = 0,
  //   lastRetryDate = NULL,
  //   updatedAt = NOW()
  // WHERE id = billingRecordId
}

/**
 * 결제 실패 시 재시도 스케줄
 */
async function scheduleBillingRetry(billingRecordId: number, errorMessage: string) {
  console.log(`[Billing] Scheduling retry for billing record ${billingRecordId}`);

  // DB에 재시도 기록 생성
  // INSERT INTO billing_attempts (billingRecordId, attemptNumber, status, errorMessage, nextRetryDate)
  // SELECT billingRecordId, retryCount + 1, 'failed', errorMessage, DATE_ADD(NOW(), INTERVAL ${RETRY_INTERVAL_DAYS} DAY)
}

/**
 * 실패한 결제 재시도 처리
 */
async function processFailedBillingRetries() {
  console.log('[Billing] Processing failed billing retries');

  try {
    // 1. 재시도 대상 조회 (nextRetryDate <= 오늘 AND retryCount < MAX_RETRY_ATTEMPTS)
    const failedAttempts = await getFailedBillingAttempts();

    console.log(`[Billing] Found ${failedAttempts.length} failed attempts to retry`);

    // 2. 각 실패 기록별 재시도
    for (const attempt of failedAttempts) {
      await retryBillingAttempt(attempt);
    }
  } catch (error) {
    console.error('[Billing] Error processing failed billing retries:', error);
  }
}

/**
 * 재시도 대상 조회
 */
async function getFailedBillingAttempts(): Promise<BillingAttempt[]> {
  // 실제 구현에서는 DB에서 조회
  return [];
}

/**
 * 개별 재시도 처리
 */
async function retryBillingAttempt(attempt: BillingAttempt) {
  try {
    console.log(`[Billing] Retrying billing attempt ${attempt.id} (attempt #${attempt.attemptNumber})`);

    // 결제 재시도
    const paymentResult = await attemptPayment({
      id: attempt.billingRecordId,
      userId: 0,
      stripeCustomerId: '',
      amount: attempt.amount,
      currency: 'KRW',
      billingCycle: 'monthly',
      nextBillingDate: new Date(),
      status: 'active',
      retryCount: attempt.attemptNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (paymentResult.success) {
      // 재시도 성공
      console.log(`[Billing] Retry successful for attempt ${attempt.id}`);
      await updateBillingAttemptSuccess(attempt.id, paymentResult.transactionId);
    } else {
      // 재시도 실패
      if (attempt.attemptNumber < MAX_RETRY_ATTEMPTS) {
        // 다음 재시도 스케줄
        console.log(`[Billing] Retry failed, scheduling next attempt`);
        await scheduleNextRetry(attempt.id, paymentResult.error);
      } else {
        // 최대 재시도 횟수 초과
        console.log(`[Billing] Max retry attempts exceeded for attempt ${attempt.id}`);
        await suspendBilling(attempt.billingRecordId);
      }
    }
  } catch (error) {
    console.error(`[Billing] Error retrying billing attempt ${attempt.id}:`, error);
  }
}

/**
 * 재시도 성공 시 업데이트
 */
async function updateBillingAttemptSuccess(attemptId: number, transactionId?: string) {
  console.log(`[Billing] Updating billing attempt ${attemptId} as successful`);

  // DB 업데이트 로직
  // UPDATE billing_attempts SET status = 'success', stripePaymentIntentId = transactionId WHERE id = attemptId
}

/**
 * 다음 재시도 스케줄
 */
async function scheduleNextRetry(attemptId: number, errorMessage?: string) {
  console.log(`[Billing] Scheduling next retry for attempt ${attemptId}`);

  // DB 업데이트 로직
  // INSERT INTO billing_attempts (billingRecordId, attemptNumber, status, errorMessage, nextRetryDate)
  // SELECT billingRecordId, attemptNumber + 1, 'pending', errorMessage, DATE_ADD(NOW(), INTERVAL ${RETRY_INTERVAL_DAYS} DAY)
}

/**
 * 결제 일시 중단
 */
async function suspendBilling(billingRecordId: number) {
  console.log(`[Billing] Suspending billing for record ${billingRecordId}`);

  // DB 업데이트 로직
  // UPDATE billing_records SET status = 'suspended' WHERE id = billingRecordId

  // 협회장에게 알림
  // await notifyOwner({
  //   title: '결제 일시 중단',
  //   content: `사용자 ${userId}의 결제가 최대 재시도 횟수를 초과하여 일시 중단되었습니다.`
  // })
}

/**
 * 결제 성공 이메일 발송
 */
async function sendBillingSuccessEmail(userId: number, amount: number) {
  console.log(`[Billing] Sending billing success email to user ${userId}`);

  // 이메일 발송 로직
  // await sendEmail({
  //   type: 'billing_success',
  //   recipientEmail: user.email,
  //   recipientName: user.name,
  //   data: { amount, date: new Date().toLocaleDateString('ko-KR') }
  // })
}

/**
 * 결제 실패 알림 발송
 */
async function sendBillingFailureNotification(userId: number, errorMessage: string) {
  console.log(`[Billing] Sending billing failure notification to user ${userId}`);

  // 알림 발송 로직
  // await sendNotification({
  //   userId,
  //   title: '결제 실패',
  //   content: `결제 처리 중 오류가 발생했습니다: ${errorMessage}. 3일 후 자동으로 재시도됩니다.`
  // })
}

/**
 * 일일 정기 결제 처리 (Cron Job용)
 */
export async function dailyBillingCron() {
  await processMonthlyBilling();
}
