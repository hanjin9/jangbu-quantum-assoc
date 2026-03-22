import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Users, MessageCircle, Clock, Calendar } from 'lucide-react';

export function LiveLecture() {
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // 라이브 강의 목록 로드
    const sessions = [
      {
        id: 1,
        title: '기초 양자요법 입문 라이브',
        instructor: '박준호',
        description: '양자요법의 기초를 배우는 라이브 강의입니다.',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'scheduled',
        viewerCount: 0,
        streamUrl: 'https://stream.example.com/live/abc123',
        thumbnail: 'https://via.placeholder.com/400x225?text=기초+양자요법',
      },
      {
        id: 2,
        title: '고급 에너지 치유법',
        instructor: '이미영',
        description: '고급 에너지 치유 기법을 배우는 라이브 강의입니다.',
        startTime: new Date(),
        status: 'live',
        viewerCount: 45,
        streamUrl: 'https://stream.example.com/live/def456',
        thumbnail: 'https://via.placeholder.com/400x225?text=고급+에너지',
      },
    ];
    setLiveSessions(sessions);
    if (sessions.length > 0) {
      setSelectedSession(sessions[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedSession?.status === 'live') {
      // 채팅 메시지 로드
      const messages = [
        {
          id: 1,
          userName: '김민준',
          message: '좋은 강의 감사합니다!',
          timestamp: new Date(Date.now() - 5 * 60000),
          type: 'message',
        },
        {
          id: 2,
          userName: '이영희',
          message: '이 부분을 더 자세히 설명해주실 수 있나요?',
          timestamp: new Date(Date.now() - 3 * 60000),
          type: 'question',
        },
      ];
      setChatMessages(messages);
    }
  }, [selectedSession]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        userName: '나',
        message: newMessage,
        timestamp: new Date(),
        type: 'message',
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-8 text-white">라이브 강의</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 영상 */}
          <div className="lg:col-span-2">
            {selectedSession && (
              <div className="space-y-4">
                {/* 영상 플레이어 */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <img
                    src={selectedSession.thumbnail}
                    alt={selectedSession.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedSession.status === 'live' && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                  {selectedSession.status === 'scheduled' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-white mx-auto mb-4" />
                        <p className="text-white text-lg">
                          {formatDate(selectedSession.startTime)} {formatTime(selectedSession.startTime)} 시작
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 강의 정보 */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedSession.title}</h2>
                    <p className="text-gray-400 mb-4">{selectedSession.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{selectedSession.viewerCount}명 시청 중</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedSession.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(selectedSession.startTime)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-gray-300 mb-2">강사</p>
                    <p className="text-white font-semibold">{selectedSession.instructor}</p>
                  </div>

                  {selectedSession.status === 'scheduled' && (
                    <Button className="w-full bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold">
                      알림 설정
                    </Button>
                  )}
                  {selectedSession.status === 'live' && (
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                      라이브 시청하기
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-4">
            {/* 라이브 채팅 */}
            {selectedSession?.status === 'live' && (
              <Card className="bg-slate-900 border-slate-700 flex flex-col h-96">
                <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-semibold text-white">라이브 채팅</h3>
                </div>

                {/* 채팅 메시지 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-[#d4af37]">{msg.userName}</span>
                        <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-gray-300 mt-1">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {/* 채팅 입력 */}
                <div className="p-4 border-t border-slate-700 space-y-2">
                  <Input
                    placeholder="메시지를 입력하세요"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-slate-800 border-slate-600 text-white placeholder-gray-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="w-full bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold"
                  >
                    전송
                  </Button>
                </div>
              </Card>
            )}

            {/* 예정된 강의 목록 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white mb-3">다른 라이브 강의</h3>
              {liveSessions.map((session) => (
                <Card
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`cursor-pointer transition-all ${
                    selectedSession?.id === session.id
                      ? 'bg-[#d4af37]/20 border-[#d4af37]'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={session.thumbnail}
                        alt={session.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{session.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{session.instructor}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {session.status === 'live' && (
                            <>
                              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                              <span className="text-xs text-red-500">LIVE</span>
                            </>
                          )}
                          {session.status === 'scheduled' && (
                            <span className="text-xs text-gray-500">
                              {formatTime(session.startTime)} 시작
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
