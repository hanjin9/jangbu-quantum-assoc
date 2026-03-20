import nodemailer from 'nodemailer';
// import { notifyOwner } from './server/_core/notification';

// 임시 함수 (나중에 실제 구현으로 변경)
const notifyOwner = async (data: any) => {
  console.log('[Notification]', data);
};

// 이메일 설정 (환경 변수에서 가져오기)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'noreply@jangbu-quantum.com',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  type: 'payment' | 'refund' | 'subscription_cancel' | 'certificate' | 'welcome';
}

/**
 * 이메일 전송 함수
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    const result = await transporter.sendMail({
      from: `"장•부 협회" <${process.env.EMAIL_USER}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    console.log(`[Email] ${payload.type} email sent to ${payload.to}:`, result.messageId);
    
    // 관리자에게 알림
    // await notifyOwner({
    //   title: `이메일 발송 완료: ${payload.type}`,
    //   content: `수신자: ${payload.to}\n제목: ${payload.subject}`,
    // });

    return true;
  } catch (error) {
    console.error(`[Email Error] Failed to send ${payload.type} email:`, error);
    
    // 관리자에게 에러 알림
    // await notifyOwner({
    //   title: `이메일 발송 실패: ${payload.type}`,
    //   content: `수신자: ${payload.to}\n오류: ${error instanceof Error ? error.message : 'Unknown error'}`,
    // });

    return false;
  }
}

/**
 * 결제 완료 이메일
 */
export function getPaymentEmailTemplate(data: {
  userName: string;
  tierName: string;
  amount: string;
  date: string;
  transactionId: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; border-radius: 5px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ 결제가 완료되었습니다</h1>
          <p>양자요법 관리사 협회</p>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${data.userName}</strong>님!</p>
          
          <p>귀하의 멤버십 결제가 정상적으로 처리되었습니다.</p>
          
          <div class="info-box">
            <h3>결제 정보</h3>
            <p><strong>멤버십:</strong> ${data.tierName}</p>
            <p><strong>금액:</strong> ${data.amount}</p>
            <p><strong>결제일:</strong> ${data.date}</p>
            <p><strong>거래번호:</strong> ${data.transactionId}</p>
          </div>

          <p>이제 다음 서비스를 이용할 수 있습니다:</p>
          <ul>
            <li>전문 양자요법 교육 과정</li>
            <li>실시간 강의 및 워크숍</li>
            <li>커뮤니티 게시판 접근</li>
            <li>개인 상담 예약</li>
            <li>수료증 발급</li>
          </ul>

          <center>
            <a href="https://jangbuqntm-zfmcugcm.manus.space/dashboard" class="button">대시보드 접속</a>
          </center>

          <p>문의사항이 있으시면 언제든지 고객 지원팀에 연락해주세요.</p>
        </div>
        <div class="footer">
          <p>© 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 환불 완료 이메일
 */
export function getRefundEmailTemplate(data: {
  userName: string;
  tierName: string;
  amount: string;
  reason: string;
  date: string;
  transactionId: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #d32f2f 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #f57c00; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>환불 처리 완료</h1>
          <p>양자요법 관리사 협회</p>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${data.userName}</strong>님!</p>
          
          <p>귀하의 환불 요청이 처리되었습니다.</p>
          
          <div class="info-box">
            <h3>환불 정보</h3>
            <p><strong>멤버십:</strong> ${data.tierName}</p>
            <p><strong>환불 금액:</strong> ${data.amount}</p>
            <p><strong>환불 사유:</strong> ${data.reason}</p>
            <p><strong>처리일:</strong> ${data.date}</p>
            <p><strong>거래번호:</strong> ${data.transactionId}</p>
          </div>

          <p><strong>환불 예상 시간:</strong> 3-5 영업일 내에 원래 결제 수단으로 환불됩니다.</p>

          <p>향후 서비스 재가입을 원하시면 언제든지 문의해주세요.</p>
        </div>
        <div class="footer">
          <p>© 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 구독 취소 이메일
 */
export function getSubscriptionCancelEmailTemplate(data: {
  userName: string;
  tierName: string;
  cancellationDate: string;
  accessEndDate: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #ff6b6b; border-radius: 5px; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>구독이 취소되었습니다</h1>
          <p>양자요법 관리사 협회</p>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${data.userName}</strong>님!</p>
          
          <p>귀하의 구독이 취소되었습니다.</p>
          
          <div class="info-box">
            <h3>구독 취소 정보</h3>
            <p><strong>멤버십:</strong> ${data.tierName}</p>
            <p><strong>취소 요청일:</strong> ${data.cancellationDate}</p>
            <p><strong>서비스 이용 종료일:</strong> ${data.accessEndDate}</p>
          </div>

          <p><strong>주의:</strong> ${data.accessEndDate}까지 모든 서비스를 이용할 수 있습니다.</p>

          <p>다시 가입하고 싶으신 경우 언제든지 저희에게 연락해주세요.</p>
          
          <center>
            <a href="https://jangbuqntm-zfmcugcm.manus.space/checkout" class="button">다시 가입하기</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 수료증 발급 이메일
 */
export function getCertificateEmailTemplate(data: {
  userName: string;
  courseName: string;
  certificateId: string;
  issuedDate: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50; border-radius: 5px; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 수료증이 발급되었습니다</h1>
          <p>양자요법 관리사 협회</p>
        </div>
        <div class="content">
          <p>축하합니다, <strong>${data.userName}</strong>님!</p>
          
          <p>귀하가 수강한 과정을 성공적으로 수료하셨습니다.</p>
          
          <div class="info-box">
            <h3>수료증 정보</h3>
            <p><strong>과정명:</strong> ${data.courseName}</p>
            <p><strong>수료증 번호:</strong> ${data.certificateId}</p>
            <p><strong>발급일:</strong> ${data.issuedDate}</p>
          </div>

          <p>이 수료증은 귀하의 전문성을 증명하는 중요한 자격입니다.</p>

          <center>
            <a href="https://jangbuqntm-zfmcugcm.manus.space/profile" class="button">수료증 다운로드</a>
          </center>

          <p>계속해서 다른 과정에 도전하세요!</p>
        </div>
        <div class="footer">
          <p>© 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 환영 이메일
 */
export function getWelcomeEmailTemplate(data: {
  userName: string;
  tierName: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>환영합니다! 👋</h1>
          <p>양자요법 관리사 협회</p>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${data.userName}</strong>님!</p>
          
          <p><strong>${data.tierName}</strong> 멤버십에 가입해주셔서 감사합니다.</p>
          
          <p>이제 다음을 시작할 수 있습니다:</p>
          <ul>
            <li>✓ 전문 양자요법 교육 과정 수강</li>
            <li>✓ 실시간 강의 및 워크숍 참석</li>
            <li>✓ 커뮤니티 게시판에서 동료들과 소통</li>
            <li>✓ 개인 상담 예약</li>
            <li>✓ 수료증 발급</li>
          </ul>

          <center>
            <a href="https://jangbuqntm-zfmcugcm.manus.space/dashboard" class="button">대시보드로 이동</a>
          </center>

          <p>질문이 있으시면 고객 지원팀에 언제든지 연락해주세요.</p>
        </div>
        <div class="footer">
          <p>© 2026 장•부 양자요법 관리사 협회. 모든 권리 보유.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
