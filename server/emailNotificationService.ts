/**
 * 이메일 알림 자동화 서비스
 * 관리자 로그인, 의심 활동 감지 시 협회장에게 즉시 이메일 발송
 */

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  subject: string;
  type: 'admin_login' | 'suspicious_activity' | 'security_alert' | 'system_alert';
  content: string;
  htmlContent: string;
  sentAt: Date;
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
}

/**
 * 관리자 로그인 알림 이메일 발송
 */
export async function sendAdminLoginNotification(
  directorEmail: string,
  adminEmail: string,
  adminRole: string,
  ipAddress: string,
  userAgent: string,
  timestamp: Date
): Promise<EmailNotification> {
  const subject = `🔐 관리자 로그인 알림 - ${adminEmail}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">🔐 관리자 로그인 알림</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; margin-top: 0;">안녕하세요, 협회장님</p>
        
        <p style="color: #475569; line-height: 1.6;">
          관리자 계정으로 로그인이 발생했습니다. 아래 정보를 확인해주세요:
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #d4af37; margin: 20px 0;">
          <p style="margin: 8px 0; color: #334155;">
            <strong>로그인 관리자:</strong> ${adminEmail}
          </p>
          <p style="margin: 8px 0; color: #334155;">
            <strong>역할:</strong> ${adminRole === 'director' ? '협회장' : adminRole === 'manager' ? '부회장' : '관리자'}
          </p>
          <p style="margin: 8px 0; color: #334155;">
            <strong>IP 주소:</strong> ${ipAddress}
          </p>
          <p style="margin: 8px 0; color: #334155;">
            <strong>로그인 시간:</strong> ${timestamp.toLocaleString('ko-KR')}
          </p>
          <p style="margin: 8px 0; color: #475569; font-size: 12px;">
            <strong>기기 정보:</strong> ${userAgent.substring(0, 60)}...
          </p>
        </div>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
          ⚠️ 본인이 로그인하지 않았다면 즉시 <a href="#" style="color: #d4af37; text-decoration: none;"><strong>보안 조치</strong></a>를 취해주세요.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            이 이메일은 자동 발송되었습니다. 회신하지 마세요.
          </p>
        </div>
      </div>
    </div>
  `;

  const notification: EmailNotification = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientEmail: directorEmail,
    subject,
    type: 'admin_login',
    content: `관리자 ${adminEmail}이(가) ${timestamp.toLocaleString('ko-KR')}에 로그인했습니다.`,
    htmlContent,
    sentAt: new Date(),
    status: 'pending',
    retryCount: 0,
  };

  // TODO: 실제 이메일 발송 (NodeMailer, SendGrid 등)
  console.log(`[Email] Sending admin login notification to ${directorEmail}`);

  return notification;
}

/**
 * 의심 활동 감지 알림 이메일 발송
 */
export async function sendSuspiciousActivityNotification(
  directorEmail: string,
  activityType: string,
  details: Record<string, any>
): Promise<EmailNotification> {
  const subject = `⚠️ 의심 활동 감지 - ${activityType}`;

  const getActivityDescription = (type: string) => {
    switch (type) {
      case 'failed_logins':
        return `${details.count}회의 로그인 실패가 감지되었습니다.`;
      case 'unusual_ip':
        return `새로운 IP 주소(${details.ip})에서 접근이 감지되었습니다.`;
      case 'bulk_delete':
        return `${details.count}개의 리소스가 삭제되었습니다.`;
      case 'unauthorized_access':
        return `권한 없는 접근 시도가 감지되었습니다.`;
      default:
        return '의심 활동이 감지되었습니다.';
    }
  };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c2d12 0%, #431407 100%); padding: 30px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fca5a5; margin: 0; font-size: 24px;">⚠️ 의심 활동 감지</h1>
      </div>
      
      <div style="background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #fecaca;">
        <p style="color: #7c2d12; margin-top: 0; font-weight: bold;">긴급 보안 알림</p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p style="margin: 8px 0; color: #334155;">
            <strong>활동 유형:</strong> ${activityType}
          </p>
          <p style="margin: 8px 0; color: #334155;">
            <strong>설명:</strong> ${getActivityDescription(activityType)}
          </p>
          <p style="margin: 8px 0; color: #334155;">
            <strong>감지 시간:</strong> ${new Date().toLocaleString('ko-KR')}
          </p>
          ${details.adminEmail ? `<p style="margin: 8px 0; color: #334155;"><strong>관련 관리자:</strong> ${details.adminEmail}</p>` : ''}
        </div>
        
        <div style="background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #991b1b; margin: 0; font-size: 14px;">
            🔴 <strong>즉시 조치 필요:</strong> 이 활동이 승인되지 않은 것이라면 즉시 보안 팀에 연락해주세요.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #fecaca;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            이 이메일은 자동 발송되었습니다. 회신하지 마세요.
          </p>
        </div>
      </div>
    </div>
  `;

  const notification: EmailNotification = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientEmail: directorEmail,
    subject,
    type: 'suspicious_activity',
    content: getActivityDescription(activityType),
    htmlContent,
    sentAt: new Date(),
    status: 'pending',
    retryCount: 0,
  };

  // TODO: 실제 이메일 발송
  console.log(`[Email] Sending suspicious activity notification to ${directorEmail}`);

  return notification;
}

/**
 * 시스템 보안 알림 이메일 발송
 */
export async function sendSecurityAlertNotification(
  directorEmail: string,
  alertType: string,
  message: string
): Promise<EmailNotification> {
  const subject = `🛡️ 시스템 보안 알림 - ${alertType}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 30px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #93c5fd; margin: 0; font-size: 24px;">🛡️ 시스템 보안 알림</h1>
      </div>
      
      <div style="background: #eff6ff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #bfdbfe;">
        <p style="color: #1e40af; margin-top: 0; font-weight: bold;">보안 알림</p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          <p style="margin: 8px 0; color: #334155;">
            <strong>알림 유형:</strong> ${alertType}
          </p>
          <p style="margin: 8px 0; color: #334155;">
            <strong>메시지:</strong> ${message}
          </p>
          <p style="margin: 8px 0; color: #334155;">
            <strong>발생 시간:</strong> ${new Date().toLocaleString('ko-KR')}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #bfdbfe;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            이 이메일은 자동 발송되었습니다. 회신하지 마세요.
          </p>
        </div>
      </div>
    </div>
  `;

  const notification: EmailNotification = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientEmail: directorEmail,
    subject,
    type: 'security_alert',
    content: message,
    htmlContent,
    sentAt: new Date(),
    status: 'pending',
    retryCount: 0,
  };

  // TODO: 실제 이메일 발송
  console.log(`[Email] Sending security alert to ${directorEmail}`);

  return notification;
}

/**
 * 이메일 발송 큐 처리 (재시도 로직 포함)
 */
export async function processEmailQueue(
  notifications: EmailNotification[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const notification of notifications) {
    if (notification.status === 'pending' && notification.retryCount < 3) {
      try {
        // TODO: 실제 이메일 발송 로직
        // const result = await sendEmail({
        //   to: notification.recipientEmail,
        //   subject: notification.subject,
        //   html: notification.htmlContent,
        // });

        notification.status = 'sent';
        sent++;
        console.log(`[Email] Successfully sent to ${notification.recipientEmail}`);
      } catch (error) {
        notification.retryCount++;
        if (notification.retryCount >= 3) {
          notification.status = 'failed';
          failed++;
        }
        console.error(`[Email] Failed to send to ${notification.recipientEmail}:`, error);
      }
    }
  }

  return { sent, failed };
}

/**
 * 배치 이메일 발송 (일일 요약)
 */
export async function sendDailySummaryEmail(
  directorEmail: string,
  summary: {
    totalLogins: number;
    suspiciousActivities: number;
    failedAttempts: number;
    newMembers: number;
    revenue: number;
  }
): Promise<EmailNotification> {
  const subject = `📊 일일 보안 및 활동 요약 - ${new Date().toLocaleDateString('ko-KR')}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">📊 일일 요약 리포트</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; margin-top: 0;">안녕하세요, 협회장님</p>
        
        <p style="color: #475569; line-height: 1.6;">
          어제의 협회 활동 및 보안 현황을 요약해드립니다:
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">관리자 로그인</p>
            <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">${summary.totalLogins}</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">신규 회원</p>
            <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">${summary.newMembers}</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">의심 활동</p>
            <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">${summary.suspiciousActivities}</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #d4af37;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">수익</p>
            <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">₩${summary.revenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            이 이메일은 자동 발송되었습니다. 회신하지 마세요.
          </p>
        </div>
      </div>
    </div>
  `;

  const notification: EmailNotification = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientEmail: directorEmail,
    subject,
    type: 'system_alert',
    content: `일일 요약: 로그인 ${summary.totalLogins}회, 의심 활동 ${summary.suspiciousActivities}회`,
    htmlContent,
    sentAt: new Date(),
    status: 'pending',
    retryCount: 0,
  };

  return notification;
}
