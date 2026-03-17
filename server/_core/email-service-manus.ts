import { notifyOwner } from './notification';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * Manus 내장 이메일 서비스를 통한 이메일 발송
 * notifyOwner API를 기반으로 구현
 */
export async function sendEmailViaManus(payload: EmailPayload): Promise<boolean> {
  try {
    // Manus 내장 이메일 API 호출
    // TODO: Manus 이메일 서비스 API 엔드포인트로 변경
    const response = await fetch(process.env.BUILT_IN_FORGE_API_URL + '/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo || 'support@jangbu-assoc.com'
      })
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✓ Email sent to ${payload.to}: ${payload.subject}`);
    
    return true;
  } catch (error) {
    console.error(`✗ Failed to send email to ${payload.to}:`, error);
    
    // Fallback: 관리자에게 알림
    try {
      await notifyOwner({
        title: '이메일 발송 실패',
        content: `수신자: ${payload.to}\n제목: ${payload.subject}\n오류: ${(error as Error).message}`
      });
    } catch (notifyError) {
      console.error('Failed to notify owner:', notifyError);
    }
    
    return false;
  }
}

/**
 * 배치 이메일 발송 (여러 수신자)
 */
export async function sendBatchEmails(
  recipients: string[],
  subject: string,
  html: string,
  text: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const result = await sendEmailViaManus({
      to: recipient,
      subject,
      html,
      text
    });

    if (result) {
      success++;
    } else {
      failed++;
    }

    // Rate limiting: 100ms 간격
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`Batch email results: ${success} sent, ${failed} failed`);
  return { success, failed };
}

/**
 * 예약 이메일 발송
 */
export async function scheduleEmail(
  payload: EmailPayload,
  delayMs: number
): Promise<void> {
  setTimeout(async () => {
    await sendEmailViaManus(payload);
  }, delayMs);
}
