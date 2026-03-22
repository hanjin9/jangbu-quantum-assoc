/**
 * 모바일 앱 연동 및 푸시 알림 서비스
 * 실시간 알림 및 긴급 상황 대응
 */

export interface MobileDevice {
  id: string;
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android';
  appVersion: string;
  osVersion: string;
  isActive: boolean;
  lastSeen: Date;
  registeredAt: Date;
}

export interface PushNotification {
  id: string;
  deviceToken: string;
  title: string;
  body: string;
  type: 'admin_login' | 'suspicious_activity' | 'urgent_alert' | 'system_notification';
  data?: Record<string, any>;
  sentAt: Date;
  status: 'pending' | 'sent' | 'failed';
  priority: 'high' | 'normal' | 'low';
}

export interface MobileAlert {
  id: string;
  userId: string;
  title: string;
  message: string;
  actionUrl?: string;
  alertType: 'critical' | 'warning' | 'info';
  createdAt: Date;
  expiresAt: Date;
  isRead: boolean;
}

// 메모리 저장소 (실제로는 데이터베이스 사용)
const deviceRegistry = new Map<string, MobileDevice>();
const pushQueue: PushNotification[] = [];
const mobileAlerts: MobileAlert[] = [];

/**
 * 모바일 기기 등록
 */
export async function registerMobileDevice(
  userId: string,
  deviceToken: string,
  platform: 'ios' | 'android',
  appVersion: string,
  osVersion: string
): Promise<MobileDevice> {
  const device: MobileDevice = {
    id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    deviceToken,
    platform,
    appVersion,
    osVersion,
    isActive: true,
    lastSeen: new Date(),
    registeredAt: new Date(),
  };

  deviceRegistry.set(device.id, device);
  console.log(`[Mobile] Device registered: ${platform} - ${deviceToken.substring(0, 20)}...`);

  return device;
}

/**
 * 관리자 로그인 푸시 알림 발송
 */
export async function sendAdminLoginPushNotification(
  directorUserId: string,
  adminEmail: string,
  adminRole: string,
  ipAddress: string
): Promise<PushNotification[]> {
  const devices = Array.from(deviceRegistry.values()).filter(
    (d) => d.userId === directorUserId && d.isActive
  );

  const notifications: PushNotification[] = [];

  for (const device of devices) {
    const notification: PushNotification = {
      id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceToken: device.deviceToken,
      title: '🔐 관리자 로그인',
      body: `${adminEmail}이(가) 로그인했습니다. IP: ${ipAddress}`,
      type: 'admin_login',
      data: {
        adminEmail,
        adminRole,
        ipAddress,
        timestamp: new Date().toISOString(),
        actionUrl: '/audit-logs',
      },
      sentAt: new Date(),
      status: 'pending',
      priority: 'high',
    };

    pushQueue.push(notification);
    notifications.push(notification);
  }

  console.log(`[Mobile] Queued ${notifications.length} admin login notifications`);
  return notifications;
}

/**
 * 의심 활동 감지 푸시 알림 발송
 */
export async function sendSuspiciousActivityPushNotification(
  directorUserId: string,
  activityType: string,
  details: Record<string, any>
): Promise<PushNotification[]> {
  const devices = Array.from(deviceRegistry.values()).filter(
    (d) => d.userId === directorUserId && d.isActive
  );

  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'failed_logins':
        return '⚠️ 로그인 실패 감지';
      case 'unusual_ip':
        return '⚠️ 비정상 접근 감지';
      case 'bulk_delete':
        return '⚠️ 대량 삭제 감지';
      case 'unauthorized_access':
        return '🚨 권한 없는 접근';
      default:
        return '⚠️ 의심 활동 감지';
    }
  };

  const getActivityMessage = (type: string, details: Record<string, any>) => {
    switch (type) {
      case 'failed_logins':
        return `${details.count}회의 로그인 실패가 감지되었습니다.`;
      case 'unusual_ip':
        return `새로운 IP(${details.ip})에서 접근이 감지되었습니다.`;
      case 'bulk_delete':
        return `${details.count}개의 리소스가 삭제되었습니다.`;
      case 'unauthorized_access':
        return `권한 없는 접근 시도: ${details.resource}`;
      default:
        return '의심 활동이 감지되었습니다.';
    }
  };

  const notifications: PushNotification[] = [];

  for (const device of devices) {
    const notification: PushNotification = {
      id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceToken: device.deviceToken,
      title: getActivityTitle(activityType),
      body: getActivityMessage(activityType, details),
      type: 'suspicious_activity',
      data: {
        activityType,
        details,
        timestamp: new Date().toISOString(),
        actionUrl: '/audit-logs',
      },
      sentAt: new Date(),
      status: 'pending',
      priority: 'high',
    };

    pushQueue.push(notification);
    notifications.push(notification);
  }

  console.log(`[Mobile] Queued ${notifications.length} suspicious activity notifications`);
  return notifications;
}

/**
 * 긴급 알림 발송
 */
export async function sendUrgentAlert(
  directorUserId: string,
  title: string,
  message: string,
  actionUrl?: string
): Promise<MobileAlert> {
  const alert: MobileAlert = {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: directorUserId,
    title,
    message,
    actionUrl,
    alertType: 'critical',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간 유효
    isRead: false,
  };

  mobileAlerts.push(alert);

  // 동시에 푸시 알림도 발송
  const devices = Array.from(deviceRegistry.values()).filter(
    (d) => d.userId === directorUserId && d.isActive
  );

  for (const device of devices) {
    const pushNotification: PushNotification = {
      id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceToken: device.deviceToken,
      title: `🚨 ${title}`,
      body: message,
      type: 'urgent_alert',
      data: {
        alertId: alert.id,
        actionUrl,
        timestamp: new Date().toISOString(),
      },
      sentAt: new Date(),
      status: 'pending',
      priority: 'high',
    };

    pushQueue.push(pushNotification);
  }

  console.log(`[Mobile] Created urgent alert and queued ${devices.length} notifications`);
  return alert;
}

/**
 * 푸시 알림 큐 처리
 */
export async function processPushNotificationQueue(): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  const pendingNotifications = pushQueue.filter((n) => n.status === 'pending');

  for (const notification of pendingNotifications) {
    try {
      // TODO: 실제 푸시 알림 발송 (Firebase Cloud Messaging, APNs 등)
      // const result = await sendPushNotification({
      //   deviceToken: notification.deviceToken,
      //   title: notification.title,
      //   body: notification.body,
      //   data: notification.data,
      //   priority: notification.priority,
      // });

      notification.status = 'sent';
      sent++;
      console.log(`[Mobile] Push notification sent to ${notification.deviceToken.substring(0, 20)}...`);
    } catch (error) {
      notification.status = 'failed';
      failed++;
      console.error(`[Mobile] Failed to send push notification:`, error);
    }
  }

  return { sent, failed };
}

/**
 * 사용자의 모바일 알림 조회
 */
export async function getUserMobileAlerts(
  userId: string,
  limit: number = 20
): Promise<MobileAlert[]> {
  return mobileAlerts
    .filter((alert) => alert.userId === userId && alert.expiresAt > new Date())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

/**
 * 모바일 알림 읽음 처리
 */
export async function markAlertAsRead(alertId: string): Promise<boolean> {
  const alert = mobileAlerts.find((a) => a.id === alertId);
  if (alert) {
    alert.isRead = true;
    return true;
  }
  return false;
}

/**
 * 모바일 기기 마지막 활동 업데이트
 */
export async function updateDeviceLastSeen(deviceId: string): Promise<boolean> {
  const device = deviceRegistry.get(deviceId);
  if (device) {
    device.lastSeen = new Date();
    return true;
  }
  return false;
}

/**
 * 비활성 기기 정리
 */
export async function cleanupInactiveDevices(inactiveDays: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

  let removed = 0;
  for (const [id, device] of deviceRegistry.entries()) {
    if (device.lastSeen < cutoffDate) {
      deviceRegistry.delete(id);
      removed++;
    }
  }

  console.log(`[Mobile] Cleaned up ${removed} inactive devices`);
  return removed;
}

/**
 * 실시간 알림 대시보드 데이터
 */
export async function getRealTimeNotificationDashboard(userId: string): Promise<Record<string, any>> {
  const userDevices = Array.from(deviceRegistry.values()).filter((d) => d.userId === userId);
  const userAlerts = mobileAlerts.filter((a) => a.userId === userId && a.expiresAt > new Date());
  const unreadAlerts = userAlerts.filter((a) => !a.isRead);
  const pendingNotifications = pushQueue.filter((n) => n.status === 'pending');

  return {
    registeredDevices: userDevices.length,
    activeDevices: userDevices.filter((d) => d.isActive).length,
    totalAlerts: userAlerts.length,
    unreadAlerts: unreadAlerts.length,
    pendingNotifications: pendingNotifications.length,
    devices: userDevices.map((d) => ({
      id: d.id,
      platform: d.platform,
      appVersion: d.appVersion,
      osVersion: d.osVersion,
      lastSeen: d.lastSeen,
      isActive: d.isActive,
    })),
    recentAlerts: userAlerts.slice(0, 5),
  };
}

/**
 * 긴급 상황 대응 프로토콜
 */
export async function initiateEmergencyResponse(
  userId: string,
  emergencyType: string,
  details: Record<string, any>
): Promise<void> {
  console.log(`[Emergency] Initiating emergency response: ${emergencyType}`);

  // 1. 긴급 알림 발송
  await sendUrgentAlert(
    userId,
    `🚨 긴급: ${emergencyType}`,
    details.message || '긴급 상황이 발생했습니다. 즉시 확인해주세요.',
    '/admin-dashboard'
  );

  // 2. 모든 활성 기기에 푸시 알림 발송
  const devices = Array.from(deviceRegistry.values()).filter(
    (d) => d.userId === userId && d.isActive
  );

  for (const device of devices) {
    const notification: PushNotification = {
      id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceToken: device.deviceToken,
      title: `🚨 긴급 상황 발생`,
      body: details.message || '긴급 상황이 발생했습니다.',
      type: 'urgent_alert',
      data: {
        emergencyType,
        details,
        timestamp: new Date().toISOString(),
        actionUrl: '/admin-dashboard',
      },
      sentAt: new Date(),
      status: 'pending',
      priority: 'high',
    };

    pushQueue.push(notification);
  }

  // 3. 푸시 알림 큐 즉시 처리
  await processPushNotificationQueue();

  console.log(`[Emergency] Emergency response initiated for ${devices.length} devices`);
}
