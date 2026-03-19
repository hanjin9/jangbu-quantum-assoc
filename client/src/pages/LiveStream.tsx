import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Users, Clock } from 'lucide-react';
import LiveStreamChat from '@/components/LiveStreamChat';

export default function LiveStream() {
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">라이브 강의</h1>

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

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedStream.title}</h2>
                  <p className="text-gray-300 mb-4">{selectedStream.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">강사</p>
                      <p className="text-white font-bold">{selectedStream.instructor}</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">시간</p>
                      <p className="text-white font-bold">{selectedStream.duration}분</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">시청자</p>
                      <p className="text-white font-bold flex items-center gap-1">
                        <Users className="w-4 h-4 text-amber-400" />
                        {selectedStream.viewers}명
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <Card
                key={stream.id}
                className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition cursor-pointer overflow-hidden"
                onClick={() => setSelectedStream(stream)}
              >
                <div className="relative bg-gradient-to-br from-amber-900 to-slate-900 h-40 flex items-center justify-center">
                  {stream.status === 'live' && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      LIVE
                    </div>
                  )}
                  <Play className="w-16 h-16 text-amber-400" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{stream.title}</h3>
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

                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    {stream.status === 'live' ? '지금 참여' : '예약하기'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
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
