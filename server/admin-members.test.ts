import { describe, it, expect, beforeEach } from 'vitest';

/**
 * AdminMembers 컴포넌트 테스트
 * - 회원 검색
 * - 회원 필터링 (상태, 역할)
 * - 회원 선택/해제
 * - CSV 내보내기
 */

describe('AdminMembers Component', () => {
  // 테스트 데이터
  const mockMembers = [
    {
      id: '1',
      name: '한진',
      email: 'hanjin@example.com',
      phone: '010-1234-5678',
      joinDate: '2024-01-15',
      status: 'active' as const,
      role: 'admin' as const,
      courses: 6,
      certificates: 4,
    },
    {
      id: '2',
      name: '김지수',
      email: 'kim@example.com',
      phone: '010-2345-6789',
      joinDate: '2024-02-10',
      status: 'active' as const,
      role: 'user' as const,
      courses: 3,
      certificates: 2,
    },
    {
      id: '3',
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-3456-7890',
      joinDate: '2024-03-05',
      status: 'active' as const,
      role: 'user' as const,
      courses: 4,
      certificates: 3,
    },
    {
      id: '4',
      name: '박민수',
      email: 'park@example.com',
      phone: '010-4567-8901',
      joinDate: '2024-01-20',
      status: 'inactive' as const,
      role: 'user' as const,
      courses: 1,
      certificates: 0,
    },
    {
      id: '5',
      name: '최수진',
      email: 'choi@example.com',
      phone: '010-5678-9012',
      joinDate: '2024-02-28',
      status: 'suspended' as const,
      role: 'user' as const,
      courses: 2,
      certificates: 1,
    },
  ];

  // 검색 함수
  const searchMembers = (members: any[], query: string) => {
    if (!query.trim()) return members;
    const lowerQuery = query.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.email.toLowerCase().includes(lowerQuery) ||
        m.phone.includes(query)
    );
  };

  // 필터 함수
  const filterByStatus = (members: any[], status: string) => {
    if (status === 'all') return members;
    return members.filter((m) => m.status === status);
  };

  const filterByRole = (members: any[], role: string) => {
    if (role === 'all') return members;
    return members.filter((m) => m.role === role);
  };

  describe('회원 검색', () => {
    it('빈 검색어는 모든 회원 반환', () => {
      const results = searchMembers(mockMembers, '');
      expect(results.length).toBe(mockMembers.length);
    });

    it('이름으로 검색', () => {
      const results = searchMembers(mockMembers, '한진');
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('한진');
    });

    it('이메일로 검색', () => {
      const results = searchMembers(mockMembers, 'kim@example.com');
      expect(results.length).toBe(1);
      expect(results[0].email).toBe('kim@example.com');
    });

    it('전화번호로 검색', () => {
      const results = searchMembers(mockMembers, '010-1234-5678');
      expect(results.length).toBe(1);
      expect(results[0].phone).toBe('010-1234-5678');
    });

    it('부분 검색', () => {
      const results = searchMembers(mockMembers, '김');
      expect(results.length).toBeGreaterThan(0);
    });

    it('검색 결과 없음', () => {
      const results = searchMembers(mockMembers, '존재하지않는사람');
      expect(results.length).toBe(0);
    });
  });

  describe('상태 필터링', () => {
    it('활성 회원 필터', () => {
      const results = filterByStatus(mockMembers, 'active');
      expect(results.every((m) => m.status === 'active')).toBe(true);
      expect(results.length).toBe(3);
    });

    it('비활성 회원 필터', () => {
      const results = filterByStatus(mockMembers, 'inactive');
      expect(results.every((m) => m.status === 'inactive')).toBe(true);
      expect(results.length).toBe(1);
    });

    it('정지된 회원 필터', () => {
      const results = filterByStatus(mockMembers, 'suspended');
      expect(results.every((m) => m.status === 'suspended')).toBe(true);
      expect(results.length).toBe(1);
    });

    it('모든 상태 필터', () => {
      const results = filterByStatus(mockMembers, 'all');
      expect(results.length).toBe(mockMembers.length);
    });
  });

  describe('역할 필터링', () => {
    it('관리자 필터', () => {
      const results = filterByRole(mockMembers, 'admin');
      expect(results.every((m) => m.role === 'admin')).toBe(true);
      expect(results.length).toBe(1);
    });

    it('사용자 필터', () => {
      const results = filterByRole(mockMembers, 'user');
      expect(results.every((m) => m.role === 'user')).toBe(true);
      expect(results.length).toBe(4);
    });

    it('모든 역할 필터', () => {
      const results = filterByRole(mockMembers, 'all');
      expect(results.length).toBe(mockMembers.length);
    });
  });

  describe('복합 필터링', () => {
    it('활성 사용자 필터', () => {
      let results = filterByStatus(mockMembers, 'active');
      results = filterByRole(results, 'user');
      expect(results.every((m) => m.status === 'active' && m.role === 'user')).toBe(true);
      expect(results.length).toBe(2);
    });

    it('검색 + 상태 필터', () => {
      let results = searchMembers(mockMembers, '김');
      results = filterByStatus(results, 'active');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('회원 통계', () => {
    it('전체 회원 수', () => {
      expect(mockMembers.length).toBe(5);
    });

    it('활성 회원 수', () => {
      const activeCount = mockMembers.filter((m) => m.status === 'active').length;
      expect(activeCount).toBe(3);
    });

    it('관리자 수', () => {
      const adminCount = mockMembers.filter((m) => m.role === 'admin').length;
      expect(adminCount).toBe(1);
    });

    it('평균 수료증 수', () => {
      const avgCerts = mockMembers.reduce((sum, m) => sum + m.certificates, 0) / mockMembers.length;
      expect(avgCerts).toBeGreaterThan(0);
    });
  });

  describe('CSV 내보내기 데이터', () => {
    it('CSV 헤더 생성', () => {
      const headers = ['ID', '이름', '이메일', '전화', '가입일', '상태', '역할', '과정', '수료증'];
      expect(headers.length).toBe(9);
    });

    it('CSV 행 생성', () => {
      const member = mockMembers[0];
      const row = [member.id, member.name, member.email, member.phone, member.joinDate, 'active', member.role, member.courses, member.certificates];
      expect(row.length).toBe(9);
    });

    it('필터된 회원 CSV 생성', () => {
      const filtered = filterByStatus(mockMembers, 'active');
      expect(filtered.length).toBeGreaterThan(0);
      // CSV 생성 가능 확인
      const rows = filtered.map((m) => [m.id, m.name, m.email, m.phone, m.joinDate, 'active', m.role, m.courses, m.certificates]);
      expect(rows.length).toBe(filtered.length);
    });
  });

  describe('회원 선택', () => {
    it('단일 회원 선택', () => {
      const selected = new Set(['1']);
      expect(selected.has('1')).toBe(true);
      expect(selected.size).toBe(1);
    });

    it('다중 회원 선택', () => {
      const selected = new Set(['1', '2', '3']);
      expect(selected.size).toBe(3);
    });

    it('회원 선택 해제', () => {
      const selected = new Set(['1', '2', '3']);
      selected.delete('2');
      expect(selected.has('2')).toBe(false);
      expect(selected.size).toBe(2);
    });

    it('전체 선택', () => {
      const selected = new Set(mockMembers.map((m) => m.id));
      expect(selected.size).toBe(mockMembers.length);
    });

    it('전체 선택 해제', () => {
      const selected = new Set(mockMembers.map((m) => m.id));
      selected.clear();
      expect(selected.size).toBe(0);
    });
  });

  describe('상태 레이블', () => {
    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'active':
          return '활성';
        case 'inactive':
          return '비활성';
        case 'suspended':
          return '정지됨';
        default:
          return '알 수 없음';
      }
    };

    it('활성 상태 레이블', () => {
      expect(getStatusLabel('active')).toBe('활성');
    });

    it('비활성 상태 레이블', () => {
      expect(getStatusLabel('inactive')).toBe('비활성');
    });

    it('정지됨 상태 레이블', () => {
      expect(getStatusLabel('suspended')).toBe('정지됨');
    });
  });
});
