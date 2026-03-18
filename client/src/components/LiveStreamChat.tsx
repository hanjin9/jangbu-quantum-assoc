import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, MessageCircle, Reply } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

interface ChatMessage {
  id: number;
  streamId: number;
  userId: number;
  userName: string;
  message: string;
  isInstructorReply: boolean;
  createdAt: Date;
  replyToMessageId?: number;
}

interface LiveStreamChatProps {
  streamId: number;
}

export default function LiveStreamChat({ streamId }: LiveStreamChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // 초기 메시지 로드
    const mockMessages: ChatMessage[] = [
      { id: 1, streamId, userId: 1, userName: '김민지', message: '기초 이론이 정말 도움이 됩니다!', isInstructorReply: false, createdAt: new Date(Date.now() - 60000) },
      { id: 2, streamId, userId: 2, userName: '강사님', message: '감사합니다! 더 궁금한 점이 있으시면 언제든 질문해주세요.', isInstructorReply: true, createdAt: new Date(Date.now() - 50000) },
      { id: 3, streamId, userId: 3, userName: '이준호', message: '실습은 어떻게 하나요?', isInstructorReply: false, createdAt: new Date(Date.now() - 30000) }
    ];
    setMessages(mockMessages);
  }, [streamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      streamId,
      userId: user.id,
      userName: user.name || 'Anonymous',
      message: inputValue,
      isInstructorReply: false,
      createdAt: new Date(),
      replyToMessageId: replyingTo?.id
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setReplyingTo(null);
    setIsLoading(false);
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-96 flex flex-col">
      {/* 채팅 헤더 */}
      <div className="border-b border-slate-700 p-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white">실시간 채팅</h3>
        <span className="ml-auto text-sm text-gray-400">{messages.length}개 메시지</span>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.isInstructorReply
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-100'
                    : msg.userId === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-200'
                }`}
              >
                <p className="text-xs font-bold mb-1">{msg.userName}</p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            {msg.userId !== user?.id && (
              <div className="flex justify-start">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-amber-400 hover:text-amber-300 h-6"
                  onClick={() => handleReply(msg)}
                >
                  <Reply className="w-3 h-3 mr-1" />
                  답변하기
                </Button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 답변 대상 표시 */}
      {replyingTo && (
        <div className="border-t border-slate-700 bg-slate-700/50 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">
              <p className="text-xs text-gray-400">{replyingTo.userName}님께 답변 중</p>
              <p className="text-sm">{replyingTo.message.substring(0, 50)}...</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-gray-200 h-6"
              onClick={() => setReplyingTo(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="border-t border-slate-700 p-3">
        <div className="flex gap-2">
          <Input
            placeholder={replyingTo ? '답변을 입력하세요...' : '메시지를 입력하세요...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 text-sm"
            disabled={!user}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !user || isLoading}
            className="bg-amber-500 hover:bg-amber-600 text-white h-10"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!user && (
          <p className="text-xs text-gray-400 mt-2">로그인 후 채팅에 참여할 수 있습니다.</p>
        )}
      </div>
    </Card>
  );
}
