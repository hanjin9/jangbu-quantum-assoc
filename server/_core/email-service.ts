import { invokeLLM } from './llm';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailPayment {
  orderId: number;
  tierName: string;
  amount: string;
  date: string;
  invoiceUrl?: string;
}

interface EmailSubscription {
  tierId: string;
  tierName: string;
  renewalDate: string;
  amount: string;
}

interface EmailAppointment {
  practitionerName: string;
  date: string;
  time: string;
  location: string;
  confirmationUrl: string;
}

/**
 * Payment confirmation email template
 */
export function generatePaymentConfirmationEmail(data: EmailPayment): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 20px; }
          .label { color: #6b7280; font-size: 14px; }
          .value { font-size: 18px; font-weight: bold; color: #1f2937; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>결제 완료</h1>
            <p>장•부 양자요법 관리사 협회</p>
          </div>
          <div class="content">
            <p>안녕하세요,</p>
            <p>귀하의 결제가 성공적으로 완료되었습니다.</p>
            
            <div class="section">
              <div class="label">주문 ID</div>
              <div class="value">#${data.orderId}</div>
            </div>
            
            <div class="section">
              <div class="label">플랜</div>
              <div class="value">${data.tierName}</div>
            </div>
            
            <div class="section">
              <div class="label">금액</div>
              <div class="value">${data.amount}</div>
            </div>
            
            <div class="section">
              <div class="label">결제 날짜</div>
              <div class="value">${data.date}</div>
            </div>
            
            <p style="margin-top: 30px;">
              <a href="${data.invoiceUrl || '#'}" class="button">영수증 보기</a>
            </p>
            
            <p style="margin-top: 30px;">
              이제 대시보드에서 구독을 관리하고 모든 혜택을 이용할 수 있습니다.
            </p>
            
            <p>
              문의사항이 있으시면 언제든지 연락주세요.<br>
              <strong>이메일:</strong> support@jangbu-assoc.com<br>
              <strong>전화:</strong> +82-2-1234-5678
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
결제 완료

안녕하세요,

귀하의 결제가 성공적으로 완료되었습니다.

주문 ID: #${data.orderId}
플랜: ${data.tierName}
금액: ${data.amount}
결제 날짜: ${data.date}

이제 대시보드에서 구독을 관리하고 모든 혜택을 이용할 수 있습니다.

문의사항이 있으시면 언제든지 연락주세요.
이메일: support@jangbu-assoc.com
전화: +82-2-1234-5678

© 2026 장•부 양자요법 관리사 협회
  `;

  return {
    subject: `[장•부] 결제 완료 - 주문 #${data.orderId}`,
    html,
    text
  };
}

/**
 * Subscription renewal reminder email template
 */
export function generateSubscriptionRenewalEmail(data: EmailSubscription): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 20px; }
          .label { color: #6b7280; font-size: 14px; }
          .value { font-size: 18px; font-weight: bold; color: #1f2937; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>구독 갱신 안내</h1>
            <p>장•부 양자요법 관리사 협회</p>
          </div>
          <div class="content">
            <p>안녕하세요,</p>
            <p>귀하의 구독이 곧 갱신될 예정입니다.</p>
            
            <div class="alert">
              <strong>⚠️ 중요:</strong> 구독이 ${data.renewalDate}에 자동으로 갱신됩니다.
            </div>
            
            <div class="section">
              <div class="label">현재 플랜</div>
              <div class="value">${data.tierName}</div>
            </div>
            
            <div class="section">
              <div class="label">갱신 금액</div>
              <div class="value">${data.amount}</div>
            </div>
            
            <div class="section">
              <div class="label">갱신 예정일</div>
              <div class="value">${data.renewalDate}</div>
            </div>
            
            <p style="margin-top: 30px;">
              구독을 관리하거나 변경하려면 대시보드를 방문하세요.
            </p>
            
            <p>
              문의사항이 있으시면 언제든지 연락주세요.<br>
              <strong>이메일:</strong> support@jangbu-assoc.com<br>
              <strong>전화:</strong> +82-2-1234-5678
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
구독 갱신 안내

안녕하세요,

귀하의 구독이 곧 갱신될 예정입니다.

⚠️ 중요: 구독이 ${data.renewalDate}에 자동으로 갱신됩니다.

현재 플랜: ${data.tierName}
갱신 금액: ${data.amount}
갱신 예정일: ${data.renewalDate}

구독을 관리하거나 변경하려면 대시보드를 방문하세요.

문의사항이 있으시면 언제든지 연락주세요.
이메일: support@jangbu-assoc.com
전화: +82-2-1234-5678

© 2026 장•부 양자요법 관리사 협회
  `;

  return {
    subject: `[장•부] 구독 갱신 예정 안내`,
    html,
    text
  };
}

/**
 * Appointment confirmation email template
 */
export function generateAppointmentConfirmationEmail(data: EmailAppointment): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 20px; }
          .label { color: #6b7280; font-size: 14px; }
          .value { font-size: 18px; font-weight: bold; color: #1f2937; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>상담 예약 확인</h1>
            <p>장•부 양자요법 관리사 협회</p>
          </div>
          <div class="content">
            <p>안녕하세요,</p>
            <p>귀하의 상담 예약이 확정되었습니다.</p>
            
            <div class="section">
              <div class="label">담당 관리사</div>
              <div class="value">${data.practitionerName}</div>
            </div>
            
            <div class="section">
              <div class="label">예약 날짜</div>
              <div class="value">${data.date}</div>
            </div>
            
            <div class="section">
              <div class="label">예약 시간</div>
              <div class="value">${data.time}</div>
            </div>
            
            <div class="section">
              <div class="label">위치</div>
              <div class="value">${data.location}</div>
            </div>
            
            <p style="margin-top: 30px;">
              <a href="${data.confirmationUrl}" class="button">예약 확인/변경</a>
            </p>
            
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              예약 시간 15분 전에 도착해주시기 바랍니다.<br>
              취소 또는 변경이 필요하신 경우 24시간 전에 연락주세요.
            </p>
            
            <p>
              문의사항이 있으시면 언제든지 연락주세요.<br>
              <strong>이메일:</strong> support@jangbu-assoc.com<br>
              <strong>전화:</strong> +82-2-1234-5678
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
상담 예약 확인

안녕하세요,

귀하의 상담 예약이 확정되었습니다.

담당 관리사: ${data.practitionerName}
예약 날짜: ${data.date}
예약 시간: ${data.time}
위치: ${data.location}

예약 시간 15분 전에 도착해주시기 바랍니다.
취소 또는 변경이 필요하신 경우 24시간 전에 연락주세요.

문의사항이 있으시면 언제든지 연락주세요.
이메일: support@jangbu-assoc.com
전화: +82-2-1234-5678

© 2026 장•부 양자요법 관리사 협회
  `;

  return {
    subject: `[장•부] 상담 예약 확인 - ${data.date} ${data.time}`,
    html,
    text
  };
}

/**
 * Welcome email template for new members
 */
export function generateWelcomeEmail(memberName: string): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 20px; }
          .label { color: #6b7280; font-size: 14px; }
          .value { font-size: 18px; font-weight: bold; color: #1f2937; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
          ul { margin: 15px 0; padding-left: 20px; }
          li { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>환영합니다!</h1>
            <p>장•부 양자요법 관리사 협회</p>
          </div>
          <div class="content">
            <p>안녕하세요, ${memberName}님!</p>
            <p>장•부 양자요법 관리사 협회에 가입해주셔서 감사합니다.</p>
            
            <p style="margin-top: 20px;">이제 다음의 혜택을 이용하실 수 있습니다:</p>
            
            <ul>
              <li>전문 양자요법 관리사와의 상담</li>
              <li>개인 맞춤형 웰니스 계획</li>
              <li>월간 뉴스레터 및 건강 팁</li>
              <li>멤버 커뮤니티 접근</li>
              <li>우선 지원 및 상담</li>
            </ul>
            
            <p style="margin-top: 30px;">
              <a href="https://jangbu-assoc.com/dashboard" class="button">대시보드 방문</a>
            </p>
            
            <p style="margin-top: 30px;">
              첫 번째 상담을 예약하려면 대시보드의 "상담 예약" 섹션을 방문하세요.
            </p>
            
            <p>
              문의사항이 있으시면 언제든지 연락주세요.<br>
              <strong>이메일:</strong> support@jangbu-assoc.com<br>
              <strong>전화:</strong> +82-2-1234-5678
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
환영합니다!

안녕하세요, ${memberName}님!

장•부 양자요법 관리사 협회에 가입해주셔서 감사합니다.

이제 다음의 혜택을 이용하실 수 있습니다:
- 전문 양자요법 관리사와의 상담
- 개인 맞춤형 웰니스 계획
- 월간 뉴스레터 및 건강 팁
- 멤버 커뮤니티 접근
- 우선 지원 및 상담

첫 번째 상담을 예약하려면 대시보드의 "상담 예약" 섹션을 방문하세요.

문의사항이 있으시면 언제든지 연락주세요.
이메일: support@jangbu-assoc.com
전화: +82-2-1234-5678

© 2026 장•부 양자요법 관리사 협회
  `;

  return {
    subject: `[장•부] 환영합니다, ${memberName}님!`,
    html,
    text
  };
}

/**
 * Send email using Manus built-in email service
 */
export async function sendEmail(
  toEmail: string,
  template: EmailTemplate,
  emailType: string,
  userId: number
): Promise<boolean> {
  try {
    // TODO: Integrate with Manus email service or third-party provider
    // For now, log the email that would be sent
    console.log(`[Email Service] Sending ${emailType} email to ${toEmail}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`HTML Length: ${template.html.length} chars`);
    
    // TODO: Log email to database
    // await db.insert(emailLogs).values({
    //   userId,
    //   recipientEmail: toEmail,
    //   emailType,
    //   subject: template.subject,
    //   status: 'sent',
    //   metadata: JSON.stringify({ timestamp: new Date().toISOString() })
    // });
    
    return true;
  } catch (error) {
    console.error(`[Email Service] Failed to send ${emailType} email:`, error);
    return false;
  }
}
