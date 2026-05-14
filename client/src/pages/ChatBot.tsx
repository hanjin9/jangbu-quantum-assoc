import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle } from 'lucide-react';

export default function ChatBot() {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: 'bot', content: '안녕하세요! 양자요법 관리사 협회 AI 챗봇입니다. 궁금한 점이 있으시면 말씀해주세요.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: messages.length + 1, role: 'user', content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 챗봇 응답 시뮬레이션
    setTimeout(() => {
      const responses: Record<string, string> = {
        '가입': '멤버십 가입은 홈페이지의 "멤버십 가입하기" 버튼을 클릭하시면 됩니다. Silver, Gold, Platinum, Diamond 4가지 플랜이 있습니다.',
        '상담': '상담 예약은 "상담 예약하기" 메뉴에서 원하는 날짜와 시간을 선택하시면 됩니다. 전문 관리사가 1:1 상담을 제공합니다.',
        '자격증': '양자요법 자격증은 실기시험에 합격하면 발급됩니다. 시험은 기초, 중급, 고급 3단계로 구성되어 있습니다.',
        '시험': '실기시험은 "실기시험" 메뉴에서 응시할 수 있습니다. 합격선은 75점 이상입니다.',
        '비용': '멤버십 비용은 플랜별로 다릅니다. Silver는 월 29,900원, Gold는 49,900원, Platinum은 79,900원, Diamond는 무제한입니다.'
      };

      const response = Object.entries(responses).find(([key]) => inputValue.includes(key))?.[1] || 
        '안녕하세요! 궁금한 점이 있으시면 "가입", "상담", "자격증", "시험", "비용" 등을 입력해주세요.';

      const botMessage = { id: messages.length + 2, role: 'bot', content: response };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="w-8 h-8 text-amber-400" />
          <h1 className="text-4xl font-bold text-white">AI 상담 챗봇</h1>
        </div>

        <Card className="bg-slate-800 border-slate-700 h-96 flex flex-col">
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700 text-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex gap-2">
              <Input
                placeholder="메시지를 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* 추천 질문 */}
        <div className="mt-8">
          <p className="text-gray-400 text-sm mb-4">추천 질문:</p>
          <div className="grid grid-cols-2 gap-3">
            {['가입', '상담', '자격증', '시험'].map((keyword) => (
              <Button
                key={keyword}
                variant="outline"
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                onClick={() => {
                  setInputValue(keyword);
                  setTimeout(() => handleSendMessage(), 100);
                }}
              >
                {keyword}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
