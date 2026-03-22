/**
 * 역할 기반 접근 제어(RBAC) 및 권한 관리 시스템
 * 협회장(Director) > 부회장(Manager) > 관리자(Admin)
 */

export type AdminRole = 'director' | 'manager' | 'admin';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface RolePermissions {
  [key in AdminRole]: Permission[];
}

/**
 * 역할별 권한 정의
 */
export const rolePermissions: RolePermissions = {
  // 협회장: 모든 권한
  director: [
    // 회원 관리
    { resource: 'members', action: 'create' },
    { resource: 'members', action: 'read' },
    { resource: 'members', action: 'update' },
    { resource: 'members', action: 'delete' },
    // 강의 관리
    { resource: 'lectures', action: 'create' },
    { resource: 'lectures', action: 'read' },
    { resource: 'lectures', action: 'update' },
    { resource: 'lectures', action: 'delete' },
    // 수익 관리
    { resource: 'revenue', action: 'read' },
    { resource: 'revenue', action: 'update' },
    // 통계 및 분석
    { resource: 'analytics', action: 'read' },
    // 시스템 설정
    { resource: 'settings', action: 'read' },
    { resource: 'settings', action: 'update' },
    // 관리자 관리
    { resource: 'admins', action: 'create' },
    { resource: 'admins', action: 'read' },
    { resource: 'admins', action: 'update' },
    { resource: 'admins', action: 'delete' },
    // 감사 로그
    { resource: 'audit_logs', action: 'read' },
  ],
  // 부회장: 제한된 권한
  manager: [
    // 회원 관리 (읽기/수정만)
    { resource: 'members', action: 'read' },
    { resource: 'members', action: 'update' },
    // 강의 관리 (모든 권한)
    { resource: 'lectures', action: 'create' },
    { resource: 'lectures', action: 'read' },
    { resource: 'lectures', action: 'update' },
    { resource: 'lectures', action: 'delete' },
    // 수익 관리 (읽기만)
    { resource: 'revenue', action: 'read' },
    // 통계 및 분석 (읽기만)
    { resource: 'analytics', action: 'read' },
    // 감사 로그 (읽기만)
    { resource: 'audit_logs', action: 'read' },
  ],
  // 관리자: 최소 권한
  admin: [
    // 회원 관리 (읽기만)
    { resource: 'members', action: 'read' },
    // 강의 관리 (읽기만)
    { resource: 'lectures', action: 'read' },
    // 통계 및 분석 (읽기만)
    { resource: 'analytics', action: 'read' },
  ],
};

/**
 * 역할별 데이터 접근 범위 정의
 */
export const roleDataScope = {
  director: {
    members: { canViewAll: true, canViewPersonal: true, canViewFinancial: true },
    lectures: { canViewAll: true, canViewEnrollment: true, canViewFeedback: true },
    revenue: { canViewAll: true, canViewDetailed: true },
    analytics: { canViewAll: true, canViewPredictions: true },
  },
  manager: {
    members: { canViewAll: true, canViewPersonal: false, canViewFinancial: false },
    lectures: { canViewAll: true, canViewEnrollment: true, canViewFeedback: true },
    revenue: { canViewAll: false, canViewDetailed: false }, // 요약만
    analytics: { canViewAll: false, canViewPredictions: false }, // 기본 통계만
  },
  admin: {
    members: { canViewAll: false, canViewPersonal: false, canViewFinancial: false }, // 할당된 회원만
    lectures: { canViewAll: false, canViewEnrollment: false, canViewFeedback: false }, // 할당된 강의만
    revenue: { canViewAll: false, canViewDetailed: false }, // 접근 불가
    analytics: { canViewAll: false, canViewPredictions: false }, // 접근 불가
  },
};

/**
 * 권한 확인 함수
 */
export function hasPermission(
  role: AdminRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  const permissions = rolePermissions[role];
  return permissions.some((p) => p.resource === resource && p.action === action);
}

/**
 * 데이터 접근 범위 확인 함수
 */
export function getDataScope(role: AdminRole, resource: string): Record<string, boolean> {
  return roleDataScope[role][resource as keyof typeof roleDataScope[AdminRole]] || {};
}

/**
 * 역할 기반 쿼리 필터 생성
 */
export function buildRoleBasedFilter(role: AdminRole, resource: string, userId: string) {
  const scope = getDataScope(role, resource);

  switch (resource) {
    case 'members':
      if (scope.canViewAll) {
        return {}; // 모든 회원 조회
      } else {
        return { assignedAdminId: userId }; // 할당된 회원만
      }

    case 'lectures':
      if (scope.canViewAll) {
        return {}; // 모든 강의 조회
      } else {
        return { instructorId: userId }; // 본인이 강의하는 강의만
      }

    case 'revenue':
      if (scope.canViewAll) {
        return {}; // 모든 수익 조회
      } else {
        return null; // 접근 불가
      }

    case 'analytics':
      if (scope.canViewAll) {
        return {}; // 모든 통계 조회
      } else {
        return null; // 접근 불가
      }

    default:
      return null;
  }
}

/**
 * 역할 승격 함수 (협회장만 가능)
 */
export async function promoteAdminRole(
  targetUserId: string,
  newRole: AdminRole,
  currentUserRole: AdminRole
): Promise<{ success: boolean; message: string }> {
  // 협회장만 역할 변경 가능
  if (currentUserRole !== 'director') {
    return {
      success: false,
      message: '협회장만 관리자 역할을 변경할 수 있습니다.',
    };
  }

  // TODO: 데이터베이스에서 사용자 역할 업데이트
  return {
    success: true,
    message: `관리자 역할이 ${newRole}로 변경되었습니다.`,
  };
}

/**
 * 역할별 대시보드 데이터 제한
 */
export function filterDashboardData(
  role: AdminRole,
  data: Record<string, any>
): Record<string, any> {
  const filtered = { ...data };

  if (role === 'admin') {
    // 관리자는 기본 통계만 볼 수 있음
    delete filtered.revenueDetails;
    delete filtered.predictions;
    delete filtered.memberFinancialData;
  } else if (role === 'manager') {
    // 부회장은 상세 수익 정보 제한
    delete filtered.memberFinancialData;
    if (filtered.revenueDetails) {
      filtered.revenueDetails = filtered.revenueDetails.map((r: any) => ({
        ...r,
        personalData: undefined, // 개인 정보 제거
      }));
    }
  }

  return filtered;
}
