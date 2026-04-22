'use client';

import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Search, BookOpen, Newspaper, MessageSquare, AlertCircle } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'course' | 'news' | 'community';
  title: string;
  description: string;
  category?: string;
  date?: string;
  path: string;
}

export default function SearchResults() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'course' | 'news' | 'community'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // 교육과정 데이터
  const coursesData = [
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
    {
      id: 'course-3',
      type: 'course' as const,
      title: '치료 기법 심화',
      description: '고급 양자 치료 기법을 배웁니다.',
      category: '심화 과정',
      path: '/academy#course-3',
    },
    {
      id: 'course-4',
      type: 'course' as const,
      title: '윤리 및 전문성',
      description: '전문 관리사로서의 윤리와 책임을 배웁니다.',
      category: '전문성 과정',
      path: '/academy#course-4',
    },
    {
      id: 'course-5',
      type: 'course' as const,
      title: '마스터 과정',
      description: '양자요법의 모든 영역을 통합하여 배웁니다.',
      category: '마스터 과정',
      path: '/academy#course-5',
    },
    {
      id: 'course-6',
      type: 'course' as const,
      title: '실전 상담 기법',
      description: '실제 상담 상황에서 필요한 기법을 배웁니다.',
      category: '실전 과정',
      path: '/academy#course-6',
    },
  ];

  // 뉴스 데이터
  const newsData = [
    {
      id: 'news-1',
      type: 'news' as const,
      title: '양자요법 협회 설립 기념 특별 세미나 개최',
      description: '2024년 양자요법 협회가 공식 출범하며 기념 세미나를 개최합니다.',
      category: '공지사항',
      date: '2024-01-15',
      path: '/news#news-1',
    },
    {
      id: 'news-2',
      type: 'news' as const,
      title: '에너지 치유의 과학적 근거 발표',
      description: '최신 연구에 따르면 양자 에너지 치유가 과학적으로 입증되었습니다.',
      category: '연구 소식',
      date: '2024-01-10',
      path: '/news#news-2',
    },
    {
      id: 'news-3',
      type: 'news' as const,
      title: '국제 양자요법 컨퍼런스 개최 예정',
      description: '올해 상반기 국제 컨퍼런스가 개최될 예정입니다.',
      category: '행사 안내',
      date: '2024-01-05',
      path: '/news#news-3',
    },
    {
      id: 'news-4',
      type: 'news' as const,
      title: '신규 회원 모집 공고',
      description: '양자요법 관리사 협회에서 신규 회원을 모집합니다.',
      category: '공지사항',
      date: '2024-01-01',
      path: '/news#news-4',
    },
  ];

  // 커뮤니티 데이터
  const communityData = [
    {
      id: 'community-1',
      type: 'community' as const,
      title: '에너지 치유 경험 공유',
      description: '회원들의 에너지 치유 경험과 사례를 공유하는 게시판입니다.',
      category: '경험 공유',
      path: '/community#community-1',
    },
    {
      id: 'community-2',
      type: 'community' as const,
      title: '질문과 답변',
      description: '양자요법에 대한 질문을 하고 답변을 받는 게시판입니다.',
      category: 'Q&A',
      path: '/community#community-2',
    },
    {
      id: 'community-3',
      type: 'community' as const,
      title: '자유 게시판',
      description: '회원들이 자유롭게 소통하는 게시판입니다.',
      category: '자유 토론',
      path: '/community#community-3',
    },
    {
      id: 'community-4',
      type: 'community' as const,
      title: '뉴스 및 정보',
      description: '양자요법 관련 뉴스와 정보를 공유하는 게시판입니다.',
      category: '정보 공유',
      path: '/community#community-4',
    },
  ];

  // URL에서 검색 쿼리 추출
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const query = params.get('q') || '';
    setSearchQuery(query);

    // 검색 수행
    performSearch(query);
    setIsLoading(false);
  }, [location]);

  // 검색 수행
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const allData = [...coursesData, ...newsData, ...communityData];

    const searchResults = allData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery))
    );

    setResults(searchResults);
    setFilteredResults(searchResults);
  };

  // 필터 적용
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter((item) => item.type === selectedFilter));
    }
  }, [selectedFilter, results]);

  // 결과 타입별 아이콘 및 색상
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'course':
        return {
          icon: BookOpen,
          label: '교육과정',
          color: 'bg-blue-100 text-blue-700',
          badgeColor: 'bg-blue-500',
        };
      case 'news':
        return {
          icon: Newspaper,
          label: '뉴스',
          color: 'bg-green-100 text-green-700',
          badgeColor: 'bg-green-500',
        };
      case 'community':
        return {
          icon: MessageSquare,
          label: '커뮤니티',
          color: 'bg-purple-100 text-purple-700',
          badgeColor: 'bg-purple-500',
        };
      default:
        return {
          icon: Search,
          label: '기타',
          color: 'bg-gray-100 text-gray-700',
          badgeColor: 'bg-gray-500',
        };
    }
  };

  const handleResultClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 검색 헤더 */}
      <div className="bg-gradient-to-r from-[#1a4d7a] to-[#d4af37] text-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">검색 결과</h1>
          <div className="flex items-center gap-2 text-lg md:text-xl">
            <Search className="w-6 h-6" />
            <span>
              "<strong>{searchQuery}</strong>"에 대한 검색 결과
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
            <p className="mt-4 text-slate-600">검색 중...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <AlertCircle className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">검색 결과 없음</h2>
            <p className="text-slate-600 mb-6">
              "{searchQuery}"에 대한 검색 결과가 없습니다.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-block px-6 py-2 bg-[#d4af37] text-white font-semibold rounded-lg hover:bg-[#d4af37]/90 transition"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            {/* 필터 버튼 */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedFilter === 'all'
                    ? 'bg-[#d4af37] text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-[#d4af37]'
                }`}
              >
                전체 ({results.length})
              </button>
              <button
                onClick={() => setSelectedFilter('course')}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedFilter === 'course'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
                }`}
              >
                교육과정 ({results.filter((r) => r.type === 'course').length})
              </button>
              <button
                onClick={() => setSelectedFilter('news')}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedFilter === 'news'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-green-500'
                }`}
              >
                뉴스 ({results.filter((r) => r.type === 'news').length})
              </button>
              <button
                onClick={() => setSelectedFilter('community')}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedFilter === 'community'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-purple-500'
                }`}
              >
                커뮤니티 ({results.filter((r) => r.type === 'community').length})
              </button>
            </div>

            {/* 검색 결과 목록 */}
            <div className="space-y-4">
              {filteredResults.map((result) => {
                const typeInfo = getTypeInfo(result.type);
                const Icon = typeInfo.icon;

                return (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.path)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer p-6 border-l-4 border-[#d4af37]"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${typeInfo.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg md:text-xl font-bold text-slate-800 break-words">
                            {result.title}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap ${typeInfo.badgeColor}`}>
                            {typeInfo.label}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-3 line-clamp-2">{result.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          {result.category && (
                            <span className="inline-block px-2 py-1 bg-slate-100 rounded text-slate-700">
                              {result.category}
                            </span>
                          )}
                          {result.date && (
                            <span className="text-slate-500">
                              {new Date(result.date).toLocaleDateString('ko-KR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-[#d4af37] text-xl">→</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 결과 요약 */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-slate-700">
                <strong>{filteredResults.length}</strong>개의 결과를 찾았습니다.
                {selectedFilter !== 'all' && (
                  <>
                    {' '}
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className="text-[#d4af37] font-semibold hover:underline"
                    >
                      전체 결과 보기
                    </button>
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
