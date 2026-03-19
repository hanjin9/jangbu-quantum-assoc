import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Users, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import LiveStreamChat from '@/components/LiveStreamChat';

export default function LiveStream() {
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, live, upcoming
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const streams = [
    {
      id: 1,
      title: '기초 양자요법 이론 라이브',
      instructor: '김전문가',
      startTime: new Date(Date.now() + 3600000),
      duration: 120,
      viewers: 234,
      status: 'upcoming',
      description: '양자요법의 기본 이론과 원리를 배우는 입문 강의입니다.'
    },
    {
      id: 2,
      title: '에너지 치유 실습 세션',
      instructor: '이전문가',
      startTime: new Date(Date.now() + 7200000),
      duration: 90,
      viewers: 156,
      status: 'upcoming',
      description: '실제 에너지 치유 기법을 실습하는 실전 강의입니다.'
    },
    {
      id: 3,
      title: '양자요법 Q&A 라운드',
      instructor: '박전문가',
      startTime: new Date(Date.now() - 1800000),
      duration: 60,
      viewers: 89,
      status: 'live',
      description: '실시간으로 질문하고 답변받을 수 있는 라이브 세션입니다.'
    },
    {
      id: 4,
      title: '고급 에너지 밸런싱 기법',
      instructor: '최전문가',
      startTime: new Date(Date.now() + 10800000),
      duration: 150,
      viewers: 312,
      status: 'upcoming',
      description: '고급 에너지 밸런싱 기법을 마스터하는 심화 강의입니다.'
    },
    {
      id: 5,
      title: '실시간 진단 및 처방',
      instructor: '정전문가',
      startTime: new Date(Date.now() - 600000),
      duration: 75,
      viewers: 145,
      status: 'live',
      description: '실시간으로 진단하고 맞춤형 처방을 제공합니다.'
    },
    {
      id: 6,
      title: '웰니스 마스터클래스',
      instructor: '송전문가',
      startTime: new Date(Date.now() + 14400000),
      duration: 120,
      viewers: 98,
      status: 'upcoming',
      description: '종합 웰니스 프로그램을 배우는 마스터클래스입니다.'
    }
  ];

  // 탭 필터링
  const filteredStreams = streams.filter(stream => {
    const matchesTab = activeTab === 'all' || stream.status === activeTab;
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // 스크롤 위치 체크
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [filteredStreams]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // 카드 너비 + 간격
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">라이브 강의</h1>

        {selectedStream ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 메인 스트림 영역 */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                <div className="relative bg-gradient-to-br from-amber-900 to-slate-900 aspect-video flex items-center justify-center">
                  {selectedStream.status === 'live' && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      LIVE
                    </div>
                  )}
                  <Play className="w-24 h-24 text-amber-400" />
                </div>

                <div className="p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedStream.title}</h2>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">{selectedStream.description}</p>

                  <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs md:text-sm mb-1">강사</p>
                      <p className="text-white font-bold text-sm md:text-base">{selectedStream.instructor}</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs md:text-sm mb-1">시간</p>
                      <p className="text-white font-bold text-sm md:text-base">{selectedStream.duration}분</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs md:text-sm mb-1">시청자</p>
                      <p className="text-white font-bold text-sm md:text-base flex items-center gap-1">
                        <Users className="w-4 h-4 text-amber-400" />
                        {selectedStream.viewers}명
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-col sm:flex-row">
                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                      {selectedStream.status === 'live' ? '지금 시청' : '예약하기'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      onClick={() => setShowChat(!showChat)}
                    >
                      💬 채팅 {showChat ? '닫기' : '열기'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* 채팅 영역 */}
            {showChat && (
              <div className="lg:col-span-1">
                <LiveStreamChat streamId={selectedStream.id} />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 검색 및 필터 영역 */}
            <div className="mb-8 space-y-4">
              {/* 검색창 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="강의 제목 또는 강사명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none text-sm md:text-base"
                />
              </div>

              {/* 탭 네비게이션 */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition text-sm md:text-base ${
                    activeTab === 'all'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  전체 강의
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition text-sm md:text-base ${
                    activeTab === 'live'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  🔴 LIVE 중
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition text-sm md:text-base ${
                    activeTab === 'upcoming'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  예정된 강의
                </button>
              </div>
            </div>

            {/* 강의 목록 - 모바일 최적화 */}
            {filteredStreams.length > 0 ? (
              <div className="relative">
                {/* 스크롤 화살표 - 데스크톱에서만 표시 */}
                {canScrollLeft && (
                  <button
                    onClick={() => scroll('left')}
                    className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {canScrollRight && (
                  <button
                    onClick={() => scroll('right')}
                    className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* 카드 그리드 - 모바일 반응형 */}
                <div
                  ref={scrollContainerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 lg:pb-0"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {filteredStreams.map((stream) => (
                    <Card
                      key={stream.id}
                      className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition cursor-pointer overflow-hidden flex-shrink-0 lg:flex-shrink"
                      onClick={() => setSelectedStream(stream)}
                    >
                      <div className="relative bg-gradient-to-br from-amber-900 to-slate-900 h-40 flex items-center justify-center">
                        {stream.status === 'live' && (
                          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            LIVE
                          </div>
                        )}
                        {stream.status === 'upcoming' && (
                          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            예정
                          </div>
                        )}
                        <Play className="w-16 h-16 text-amber-400" />
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{stream.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{stream.instructor}</p>

                        <div className="space-y-2 text-sm text-gray-300 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>{stream.duration}분</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" />
                            <span>{stream.viewers}명 시청 중</span>
                          </div>
                        </div>

                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm">
                          {stream.status === 'live' ? '지금 참여' : '예약하기'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
              </div>
            )}
          </>
        )}

        {selectedStream && (
          <div className="mt-6">
            <Button
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              onClick={() => {
                setSelectedStream(null);
                setShowChat(false);
              }}
            >
              ← 강의 목록으로 돌아가기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
