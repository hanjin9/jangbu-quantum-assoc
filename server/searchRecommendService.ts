/**
 * 회원 검색 및 추천 시스템
 * - 고급 검색 필터
 * - 관심사/등급별 강의 추천
 * - 개인화 추천 알고리즘
 */

export interface SearchFilter {
  keyword?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  rating?: number; // 최소 평점
  duration?: { min: number; max: number }; // 분 단위
  sortBy?: 'rating' | 'popularity' | 'newest' | 'duration';
  page?: number;
  limit?: number;
}

export interface LectureRecommendation {
  lectureId: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  viewerCount: number;
  duration: number;
  category: string;
  level: string;
  matchScore: number; // 0-100
  reason: string; // 추천 이유
}

export interface UserProfile {
  userId: number;
  interests: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  completedLectures: number[];
  watchHistory: number[];
  ratings: Record<number, number>; // lectureId -> rating
}

/**
 * 고급 검색
 */
export async function searchLectures(filters: SearchFilter): Promise<any[]> {
  console.log(`[Search] Searching lectures with filters:`, filters);

  const {
    keyword = '',
    category,
    level,
    instructor,
    rating = 0,
    duration,
    sortBy = 'rating',
    page = 1,
    limit = 20,
  } = filters;

  // 실제 구현에서는 DB에서 조회
  // SELECT * FROM lectures WHERE
  //   (title LIKE ? OR description LIKE ?)
  //   AND (category = ? OR ? IS NULL)
  //   AND (level = ? OR ? IS NULL)
  //   AND (instructor LIKE ? OR ? IS NULL)
  //   AND averageRating >= ?
  //   AND duration BETWEEN ? AND ?
  // ORDER BY (sortBy)
  // LIMIT ? OFFSET ?

  const results = [
    {
      id: 1,
      title: '기초 양자요법 입문',
      description: '양자요법의 기초를 배우는 강의입니다.',
      instructor: '박준호',
      rating: 4.8,
      viewerCount: 1250,
      duration: 120,
      category: '기초',
      level: 'beginner',
      tags: ['양자요법', '기초', '입문'],
    },
    {
      id: 2,
      title: '고급 에너지 치유법',
      description: '고급 에너지 치유 기법을 배우는 강의입니다.',
      instructor: '이미영',
      rating: 4.7,
      viewerCount: 856,
      duration: 150,
      category: '고급',
      level: 'advanced',
      tags: ['에너지', '치유', '고급'],
    },
  ];

  console.log(`[Search] Found ${results.length} lectures`);

  return results;
}

/**
 * 개인화 강의 추천
 */
export async function getPersonalizedRecommendations(
  userId: number,
  limit: number = 5
): Promise<LectureRecommendation[]> {
  console.log(`[Search] Getting personalized recommendations for user ${userId}`);

  // 1. 사용자 프로필 조회
  const userProfile = await getUserProfile(userId);

  console.log(`[Search] User profile:`, userProfile);

  // 2. 사용자의 관심사 기반 강의 검색
  const interestBasedLectures = await searchLecturesByInterests(userProfile.interests);

  // 3. 사용자의 레벨 기반 강의 필터링
  const levelFilteredLectures = interestBasedLectures.filter(
    (lecture) => lecture.level === userProfile.level || lecture.level === 'beginner'
  );

  // 4. 이미 수강한 강의 제외
  const newLectures = levelFilteredLectures.filter(
    (lecture) => !userProfile.completedLectures.includes(lecture.id)
  );

  // 5. 추천 점수 계산
  const recommendations = newLectures.map((lecture) => {
    const matchScore = calculateMatchScore(userProfile, lecture);
    const reason = generateRecommendationReason(userProfile, lecture);

    return {
      lectureId: lecture.id,
      title: lecture.title,
      description: lecture.description,
      instructor: lecture.instructor,
      rating: lecture.rating,
      viewerCount: lecture.viewerCount,
      duration: lecture.duration,
      category: lecture.category,
      level: lecture.level,
      matchScore,
      reason,
    };
  });

  // 6. 추천 점수 기준으로 정렬
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations.slice(0, limit);
}

/**
 * 사용자 프로필 조회
 */
async function getUserProfile(userId: number): Promise<UserProfile> {
  console.log(`[Search] Fetching user profile for user ${userId}`);

  // 실제 구현에서는 DB에서 조회
  return {
    userId,
    interests: ['양자요법', '에너지 치유', '명상'],
    level: 'intermediate',
    completedLectures: [1, 3, 5],
    watchHistory: [1, 2, 3, 4, 5, 6],
    ratings: {
      1: 5,
      2: 4,
      3: 5,
    },
  };
}

/**
 * 관심사 기반 강의 검색
 */
async function searchLecturesByInterests(interests: string[]): Promise<any[]> {
  console.log(`[Search] Searching lectures by interests:`, interests);

  // 실제 구현에서는 DB에서 조회
  // SELECT * FROM lectures WHERE category IN (interests) OR tags LIKE ANY(interests)

  return [
    {
      id: 1,
      title: '기초 양자요법 입문',
      category: '양자요법',
      level: 'beginner',
      rating: 4.8,
      viewerCount: 1250,
      duration: 120,
      instructor: '박준호',
      description: '양자요법의 기초를 배우는 강의입니다.',
      tags: ['양자요법', '기초', '입문'],
    },
    {
      id: 4,
      title: '에너지 명상 마스터',
      category: '명상',
      level: 'intermediate',
      rating: 4.6,
      viewerCount: 892,
      duration: 90,
      instructor: '김성철',
      description: '에너지 명상 기법을 배우는 강의입니다.',
      tags: ['명상', '에너지', '중급'],
    },
  ];
}

/**
 * 추천 점수 계산
 */
function calculateMatchScore(userProfile: UserProfile, lecture: any): number {
  let score = 0;

  // 1. 관심사 일치도 (최대 40점)
  const interestMatch = userProfile.interests.filter((interest) =>
    lecture.tags?.includes(interest)
  ).length;
  score += Math.min(interestMatch * 10, 40);

  // 2. 레벨 일치도 (최대 30점)
  if (lecture.level === userProfile.level) {
    score += 30;
  } else if (lecture.level === 'beginner' && userProfile.level !== 'beginner') {
    score += 10;
  } else if (lecture.level === 'advanced' && userProfile.level === 'advanced') {
    score += 20;
  }

  // 3. 평점 (최대 20점)
  score += Math.min(lecture.rating * 4, 20);

  // 4. 인기도 (최대 10점)
  const popularityScore = Math.min(lecture.viewerCount / 100, 10);
  score += popularityScore;

  return Math.min(score, 100);
}

/**
 * 추천 이유 생성
 */
function generateRecommendationReason(userProfile: UserProfile, lecture: any): string {
  const reasons = [];

  // 관심사 일치
  const matchingInterests = userProfile.interests.filter((interest) =>
    lecture.tags?.includes(interest)
  );
  if (matchingInterests.length > 0) {
    reasons.push(`당신의 관심사인 "${matchingInterests[0]}"와 관련된 강의입니다`);
  }

  // 레벨 일치
  if (lecture.level === userProfile.level) {
    reasons.push(`당신의 레벨(${userProfile.level})에 적합한 강의입니다`);
  }

  // 높은 평점
  if (lecture.rating >= 4.7) {
    reasons.push(`높은 평점(${lecture.rating}/5)의 인기 강의입니다`);
  }

  // 인기 강의
  if (lecture.viewerCount > 1000) {
    reasons.push(`${lecture.viewerCount}명 이상이 수강한 인기 강의입니다`);
  }

  return reasons.length > 0 ? reasons[0] : '추천 강의입니다';
}

/**
 * 강의 검색 자동완성
 */
export async function getSearchSuggestions(keyword: string, limit: number = 10): Promise<string[]> {
  console.log(`[Search] Getting search suggestions for keyword: ${keyword}`);

  // 실제 구현에서는 DB에서 조회
  // SELECT DISTINCT title FROM lectures WHERE title LIKE ? LIMIT ?

  const suggestions = [
    '기초 양자요법 입문',
    '고급 에너지 치유법',
    '양자 명상 마스터',
    '양자 물리학 기초',
    '에너지 밸런싱 기법',
  ];

  return suggestions.filter((s) => s.toLowerCase().includes(keyword.toLowerCase())).slice(0, limit);
}

/**
 * 인기 강의 조회
 */
export async function getPopularLectures(limit: number = 10): Promise<any[]> {
  console.log(`[Search] Fetching popular lectures`);

  // 실제 구현에서는 DB에서 조회
  // SELECT * FROM lectures ORDER BY viewerCount DESC LIMIT ?

  return [
    {
      id: 1,
      title: '기초 양자요법 입문',
      instructor: '박준호',
      rating: 4.8,
      viewerCount: 1250,
      duration: 120,
      category: '기초',
    },
    {
      id: 2,
      title: '고급 에너지 치유법',
      instructor: '이미영',
      rating: 4.7,
      viewerCount: 856,
      duration: 150,
      category: '고급',
    },
  ];
}

/**
 * 최신 강의 조회
 */
export async function getNewestLectures(limit: number = 10): Promise<any[]> {
  console.log(`[Search] Fetching newest lectures`);

  // 실제 구현에서는 DB에서 조회
  // SELECT * FROM lectures ORDER BY createdAt DESC LIMIT ?

  return [
    {
      id: 7,
      title: '양자 에너지 심화 과정',
      instructor: '최혜진',
      rating: 4.5,
      viewerCount: 234,
      duration: 180,
      category: '심화',
      createdAt: new Date(),
    },
  ];
}

/**
 * 카테고리별 강의 조회
 */
export async function getLecturesByCategory(category: string, limit: number = 10): Promise<any[]> {
  console.log(`[Search] Fetching lectures for category: ${category}`);

  // 실제 구현에서는 DB에서 조회
  // SELECT * FROM lectures WHERE category = ? LIMIT ?

  return [
    {
      id: 1,
      title: '기초 양자요법 입문',
      category,
      instructor: '박준호',
      rating: 4.8,
      viewerCount: 1250,
      duration: 120,
    },
  ];
}
