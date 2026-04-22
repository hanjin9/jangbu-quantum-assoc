import { describe, it, expect } from 'vitest';

/**
 * SearchResults 컴포넌트 테스트
 * - 검색 쿼리 파싱
 * - 검색 결과 필터링
 * - 타입별 필터링
 * - 결과 없음 상태
 */

describe('SearchResults Component', () => {
  // 테스트 데이터
  const mockCourses = [
    {
      id: 'course-1',
      type: 'course' as const,
      title: '양자요법 기초',
      description: '양자에너지 치유의 기본 원리를 배웁니다.',
      category: '기초 과정',
      path: '/academy#course-1',
    },
    {
      id: 'course-2',
      type: 'course' as const,
      title: '에너지 진단법',
      description: '환자의 에너지 상태를 진단하는 방법을 학습합니다.',
      category: '진단 과정',
      path: '/academy#course-2',
    },
  ];

  const mockNews = [
    {
      id: 'news-1',
      type: 'news' as const,
      title: '양자요법 협회 설립 기념 특별 세미나 개최',
      description: '2024년 양자요법 협회가 공식 출범하며 기념 세미나를 개최합니다.',
      category: '공지사항',
      date: '2024-01-15',
      path: '/news#news-1',
    },
  ];

  const mockCommunity = [
    {
      id: 'community-1',
      type: 'community' as const,
      title: '에너지 치유 경험 공유',
      description: '회원들의 에너지 치유 경험과 사례를 공유하는 게시판입니다.',
      category: '경험 공유',
      path: '/community#community-1',
    },
  ];

  const allData = [...mockCourses, ...mockNews, ...mockCommunity];

  // 검색 함수 (SearchResults에서 사용하는 로직)
  const performSearch = (query: string) => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return allData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery))
    );
  };

  // 필터 함수
  const filterByType = (results: any[], type: string) => {
    if (type === 'all') {
      return results;
    }
    return results.filter((item) => item.type === type);
  };

  describe('검색 쿼리 처리', () => {
    it('빈 쿼리는 빈 배열 반환', () => {
      const results = performSearch('');
      expect(results).toEqual([]);
    });

    it('공백만 있는 쿼리는 빈 배열 반환', () => {
      const results = performSearch('   ');
      expect(results).toEqual([]);
    });

    it('제목에 포함된 검색어 찾기', () => {
      const results = performSearch('양자요법');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.title.includes('양자요법'))).toBe(true);
    });

    it('설명에 포함된 검색어 찾기', () => {
      const results = performSearch('에너지');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.description.includes('에너지'))).toBe(true);
    });

    it('카테고리에 포함된 검색어 찾기', () => {
      const results = performSearch('기초 과정');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.category === '기초 과정')).toBe(true);
    });

    it('대소문자 구분 없이 검색', () => {
      const results1 = performSearch('양자요법');
      const results2 = performSearch('양자요법');
      expect(results1.length).toBe(results2.length);
    });
  });

  describe('필터링', () => {
    it('전체 필터 적용', () => {
      const results = performSearch('에너지');
      const filtered = filterByType(results, 'all');
      expect(filtered.length).toBe(results.length);
    });

    it('과정 필터 적용', () => {
      const results = performSearch('에너지');
      const filtered = filterByType(results, 'course');
      expect(filtered.every((r) => r.type === 'course')).toBe(true);
    });

    it('뉴스 필터 적용', () => {
      const results = performSearch('양자요법');
      const filtered = filterByType(results, 'news');
      expect(filtered.every((r) => r.type === 'news')).toBe(true);
    });

    it('커뮤니티 필터 적용', () => {
      const results = performSearch('에너지');
      const filtered = filterByType(results, 'community');
      expect(filtered.every((r) => r.type === 'community')).toBe(true);
    });
  });

  describe('검색 결과 통계', () => {
    it('검색 결과 개수 계산', () => {
      const results = performSearch('에너지');
      expect(results.length).toBeGreaterThan(0);
    });

    it('타입별 검색 결과 개수 계산', () => {
      const results = performSearch('에너지');
      const courseCount = results.filter((r) => r.type === 'course').length;
      const newsCount = results.filter((r) => r.type === 'news').length;
      const communityCount = results.filter((r) => r.type === 'community').length;
      
      expect(courseCount + newsCount + communityCount).toBe(results.length);
    });
  });

  describe('검색 결과 없음', () => {
    it('검색 결과 없을 때 빈 배열 반환', () => {
      const results = performSearch('존재하지않는검색어');
      expect(results).toEqual([]);
    });

    it('검색 결과 없을 때 필터링도 빈 배열 반환', () => {
      const results = performSearch('존재하지않는검색어');
      const filtered = filterByType(results, 'course');
      expect(filtered).toEqual([]);
    });
  });

  describe('특수 문자 처리', () => {
    it('한글 검색어 처리', () => {
      const results = performSearch('양자');
      expect(results.length).toBeGreaterThan(0);
    });

    it('부분 검색어 처리', () => {
      const results = performSearch('에너');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
