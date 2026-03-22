import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Star, Users, Clock, Filter } from 'lucide-react';

export function SearchRecommend() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('recommend');

  const categories = ['all', '기초', '중급', '고급', '심화'];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];
  const sortOptions = [
    { value: 'rating', label: '평점순' },
    { value: 'popularity', label: '인기순' },
    { value: 'newest', label: '최신순' },
    { value: 'duration', label: '강의시간' },
  ];

  const allLectures = [
    {
      id: 1,
      title: '기초 양자요법 입문',
      instructor: '박준호',
      category: '기초',
      level: 'beginner',
      rating: 4.8,
      viewerCount: 1250,
      duration: 120,
      thumbnail: 'https://via.placeholder.com/300x200?text=기초+양자요법',
      description: '양자요법의 기초를 배우는 강의입니다.',
    },
    {
      id: 2,
      title: '고급 에너지 치유법',
      instructor: '이미영',
      category: '고급',
      level: 'advanced',
      rating: 4.7,
      viewerCount: 856,
      duration: 150,
      thumbnail: 'https://via.placeholder.com/300x200?text=고급+에너지',
      description: '고급 에너지 치유 기법을 배우는 강의입니다.',
    },
    {
      id: 3,
      title: '양자 명상 마스터',
      instructor: '김성철',
      category: '중급',
      level: 'intermediate',
      rating: 4.6,
      viewerCount: 892,
      duration: 90,
      thumbnail: 'https://via.placeholder.com/300x200?text=양자+명상',
      description: '양자 명상 기법을 마스터하는 강의입니다.',
    },
    {
      id: 4,
      title: '양자 물리학 기초',
      instructor: '최혜진',
      category: '기초',
      level: 'beginner',
      rating: 4.5,
      viewerCount: 634,
      duration: 180,
      thumbnail: 'https://via.placeholder.com/300x200?text=양자+물리학',
      description: '양자 물리학의 기초를 배우는 강의입니다.',
    },
  ];

  const handleSearch = () => {
    let results = allLectures;

    // 키워드 필터
    if (searchKeyword) {
      results = results.filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          lecture.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      results = results.filter((lecture) => lecture.category === selectedCategory);
    }

    // 레벨 필터
    if (selectedLevel !== 'all') {
      results = results.filter((lecture) => lecture.level === selectedLevel);
    }

    // 정렬
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      results.sort((a, b) => b.viewerCount - a.viewerCount);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'duration') {
      results.sort((a, b) => a.duration - b.duration);
    }

    setSearchResults(results);
  };

  const loadRecommendations = () => {
    const recs = [
      {
        ...allLectures[0],
        matchScore: 95,
        reason: '당신의 관심사인 "양자요법"과 관련된 강의입니다',
      },
      {
        ...allLectures[2],
        matchScore: 88,
        reason: '당신의 레벨(중급)에 적합한 강의입니다',
      },
      {
        ...allLectures[3],
        matchScore: 82,
        reason: '높은 평점(4.5/5)의 인기 강의입니다',
      },
    ];
    setRecommendations(recs);
  };

  const LectureCard = ({ lecture, isRecommendation = false }: any) => (
    <Card className="bg-slate-900 border-slate-700 overflow-hidden hover:border-[#d4af37] transition-colors cursor-pointer">
      <div className="relative">
        <img
          src={lecture.thumbnail}
          alt={lecture.title}
          className="w-full h-40 object-cover"
        />
        {isRecommendation && (
          <div className="absolute top-2 right-2 bg-[#d4af37] text-black px-2 py-1 rounded text-xs font-semibold">
            {lecture.matchScore}% 추천
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white line-clamp-2">{lecture.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{lecture.instructor}</p>
        </div>

        {isRecommendation && (
          <p className="text-xs text-[#d4af37] bg-[#d4af37]/10 p-2 rounded">
            {lecture.reason}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-slate-800 text-gray-300 px-2 py-1 rounded">
            {lecture.category}
          </span>
          <span className="text-xs bg-slate-800 text-gray-300 px-2 py-1 rounded">
            {lecture.level === 'beginner'
              ? '초급'
              : lecture.level === 'intermediate'
              ? '중급'
              : '고급'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-slate-700">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{lecture.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{lecture.viewerCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{lecture.duration}분</span>
          </div>
        </div>

        <Button className="w-full bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold">
          강의 보기
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-8 text-white">강의 검색 & 추천</h1>

        {/* 탭 */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => {
              setActiveTab('recommend');
              loadRecommendations();
            }}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'recommend'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            추천 강의
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'search'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            강의 검색
          </button>
        </div>

        {/* 추천 탭 */}
        {activeTab === 'recommend' && (
          <div className="space-y-6">
            <p className="text-gray-300">
              당신의 관심사와 학습 수준에 맞는 강의를 추천해드립니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.length > 0 ? (
                recommendations.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} isRecommendation />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">추천 강의를 로드 중입니다...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 검색 탭 */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* 검색 필터 */}
            <div className="space-y-4 bg-slate-900 p-6 rounded-lg border border-slate-700">
              {/* 검색 입력 */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="강의 제목, 강사명 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-500"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold"
                >
                  검색
                </Button>
              </div>

              {/* 필터 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 카테고리 */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">카테고리</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? '전체' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 레벨 */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">레벨</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level === 'all'
                          ? '전체'
                          : level === 'beginner'
                          ? '초급'
                          : level === 'intermediate'
                          ? '중급'
                          : '고급'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 정렬 */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">정렬</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 검색 결과 */}
            <div className="space-y-4">
              <p className="text-gray-300">
                {searchResults.length > 0
                  ? `${searchResults.length}개의 강의를 찾았습니다`
                  : '검색 결과가 없습니다'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
