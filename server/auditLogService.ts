/**
 * 감사 로그 및 활동 추적 시스템
 * 모든 관리자 활동을 기록하고 추적
 */

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminRole: 'director' | 'manager' | 'admin';
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, { before: any; after: any }>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: 'success' | 'failed';
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogFilter {
  adminId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'success' | 'failed';
}

// 메모리 저장소 (실제로는 데이터베이스 사용)
const auditLogs: AuditLog[] = [];

/**
 * 감사 로그 기록
 */
export async function logAuditActivity(
  adminId: string,
  adminEmail: string,
  adminRole: 'director' | 'manager' | 'admin',
  action: string,
  resource: string,
  ipAddress: string,
  userAgent: string,
  options?: {
    resourceId?: string;
    changes?: Record<string, { before: any; after: any }>;
    status?: 'success' | 'failed';
    errorMessage?: string;
    metadata?: Record<string, any>;
  }
): Promise<AuditLog> {
  const log: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    adminId,
    adminEmail,
    adminRole,
    action,
    resource,
    resourceId: options?.resourceId,
    changes: options?.changes,
    ipAddress,
    userAgent,
    timestamp: new Date(),
    status: options?.status || 'success',
    errorMessage: options?.errorMessage,
    metadata: options?.metadata,
  };

  auditLogs.push(log);

  // TODO: 데이터베이스에 저장
  console.log(`[Audit Log] ${action} on ${resource} by ${adminEmail}`);

  return log;
}

/**
 * 감사 로그 조회
 */
export async function getAuditLogs(
  filter?: AuditLogFilter,
  limit: number = 100,
  offset: number = 0
): Promise<{ logs: AuditLog[]; total: number }> {
  let filtered = [...auditLogs];

  if (filter?.adminId) {
    filtered = filtered.filter((log) => log.adminId === filter.adminId);
  }
  if (filter?.action) {
    filtered = filtered.filter((log) => log.action === filter.action);
  }
  if (filter?.resource) {
    filtered = filtered.filter((log) => log.resource === filter.resource);
  }
  if (filter?.status) {
    filtered = filtered.filter((log) => log.status === filter.status);
  }
  if (filter?.startDate) {
    filtered = filtered.filter((log) => log.timestamp >= filter.startDate!);
  }
  if (filter?.endDate) {
    filtered = filtered.filter((log) => log.timestamp <= filter.endDate!);
  }

  // 최신순 정렬
  filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return {
    logs: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

/**
 * 의심 활동 감지
 */
export async function detectSuspiciousActivity(): Promise<AuditLog[]> {
  const suspicious: AuditLog[] = [];

  // 1. 짧은 시간에 많은 실패 로그인 시도
  const failedLogins = auditLogs.filter(
    (log) =>
      log.action === 'LOGIN' &&
      log.status === 'failed' &&
      log.timestamp.getTime() > Date.now() - 30 * 60 * 1000 // 최근 30분
  );

  if (failedLogins.length >= 5) {
    suspicious.push(...failedLogins);
  }

  // 2. 비정상적인 IP 주소에서의 접근
  const ipAddresses = new Map<string, number>();
  auditLogs.forEach((log) => {
    ipAddresses.set(log.ipAddress, (ipAddresses.get(log.ipAddress) || 0) + 1);
  });

  const unusualIPs = Array.from(ipAddresses.entries())
    .filter(([_, count]) => count === 1) // 처음 나타나는 IP
    .map(([ip]) => ip);

  if (unusualIPs.length > 0) {
    const recentLogs = auditLogs.filter(
      (log) =>
        unusualIPs.includes(log.ipAddress) &&
        log.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000 // 최근 24시간
    );
    suspicious.push(...recentLogs);
  }

  // 3. 대량의 데이터 삭제 시도
  const deleteLogs = auditLogs.filter(
    (log) =>
      log.action === 'DELETE' &&
      log.timestamp.getTime() > Date.now() - 60 * 60 * 1000 // 최근 1시간
  );

  if (deleteLogs.length >= 10) {
    suspicious.push(...deleteLogs);
  }

  return suspicious;
}

/**
 * 감사 로그 통계
 */
export async function getAuditStatistics(days: number = 7): Promise<Record<string, any>> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const recentLogs = auditLogs.filter((log) => log.timestamp >= startDate);

  const stats = {
    totalActions: recentLogs.length,
    successfulActions: recentLogs.filter((log) => log.status === 'success').length,
    failedActions: recentLogs.filter((log) => log.status === 'failed').length,
    actionsByType: {} as Record<string, number>,
    actionsByAdmin: {} as Record<string, number>,
    actionsByResource: {} as Record<string, number>,
    suspiciousActivities: await detectSuspiciousActivity(),
  };

  recentLogs.forEach((log) => {
    stats.actionsByType[log.action] = (stats.actionsByType[log.action] || 0) + 1;
    stats.actionsByAdmin[log.adminEmail] = (stats.actionsByAdmin[log.adminEmail] || 0) + 1;
    stats.actionsByResource[log.resource] = (stats.actionsByResource[log.resource] || 0) + 1;
  });

  return stats;
}

/**
 * 특정 리소스의 변경 이력 조회
 */
export async function getResourceChangeHistory(
  resource: string,
  resourceId: string
): Promise<AuditLog[]> {
  return auditLogs
    .filter((log) => log.resource === resource && log.resourceId === resourceId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * 관리자별 활동 요약
 */
export async function getAdminActivitySummary(
  adminId: string,
  days: number = 30
): Promise<Record<string, any>> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const adminLogs = auditLogs.filter(
    (log) => log.adminId === adminId && log.timestamp >= startDate
  );

  return {
    totalActions: adminLogs.length,
    successRate: adminLogs.length > 0
      ? (adminLogs.filter((log) => log.status === 'success').length / adminLogs.length) * 100
      : 0,
    lastActivity: adminLogs.length > 0
      ? adminLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0].timestamp
      : null,
    actionsByType: adminLogs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    actionsByResource: adminLogs.reduce(
      (acc, log) => {
        acc[log.resource] = (acc[log.resource] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}
