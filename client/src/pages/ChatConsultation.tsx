import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  sender: "user" | "consultant";
  content: string;
  timestamp: Date;
  senderName: string;
}

export default function ChatConsultation() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 시뮬레이션: 상담사 자동 응답
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date(),
      senderName: user?.name || "사용자",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // 상담사 자동 응답 (2초 후)
    setTimeout(() => {
      const consultantResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "consultant",
        content: getConsultantResponse(inputValue),
        timestamp: new Date(),
        senderName: "양자요법 상담사",
      };
      setMessages((prev) => [...prev, consultantResponse]);
    }, 2000);
  };

  const getConsultantResponse = (userMessage: string): string => {
    const responses: { [key: string]: string } = {
      "안녕": "안녕하세요! 양자요법 상담사입니다. 어떤 도움이 필요하신가요?",
      "가격": "저희 멤버십은 기본, 프리미엄, VIP, 엘리트 4가지 티어가 있습니다. 자세한 내용은 멤버십 페이지를 참고해주세요.",
      "교육": "양자요법 전문가 자격증 과정은 6개월 동안 진행되며, 온라인과 오프라인 교육이 병행됩니다.",
      "상담": "예약하신 상담 시간에 전문 상담사가 1:1로 진행해드립니다. 편한 시간을 선택해주세요.",
      "기본": "궁금하신 점을 자세히 말씀해주시면 더 정확한 답변을 드릴 수 있습니다.",
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (userMessage.includes(keyword)) {
        return response;
      }
    }

    return "감사합니다. 더 자세한 상담이 필요하시면 예약 상담을 신청해주세요.";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-4">
            실시간 상담
          </h1>
          <p className="text-gray-300">
            양자요법 전문가와 실시간으로 상담받으세요. 평일 09:00 ~ 18:00 운영
          </p>
        </div>

        {/* 채팅 컨테이너 */}
        <div className="bg-slate-800 rounded-lg border border-yellow-400/20 overflow-hidden flex flex-col h-[600px]">
          {/* 채팅 헤더 */}
          <div className="bg-slate-700 p-4 border-b border-yellow-400/20 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-yellow-400">상담사 연결 대기</h2>
              <p className="text-sm text-gray-400">
                {isConnected ? "✓ 상담사 연결됨" : "상담사 연결 중..."}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-400 mb-4">상담을 시작하세요</p>
                  <p className="text-sm text-gray-500">
                    아래 입력창에 메시지를 입력하면 상담사가 응답합니다.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-yellow-500 text-black rounded-br-none"
                      : "bg-slate-700 text-gray-100 rounded-bl-none border border-yellow-400/20"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1 opacity-75">
                    {msg.senderName}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {msg.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="bg-slate-700 p-4 border-t border-yellow-400/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg"
              >
                전송
              </Button>
            </div>
          </div>
        </div>

        {/* 예약 상담 섹션 */}
        <div className="mt-12 bg-slate-800 p-8 rounded-lg border border-yellow-400/20">
          <h3 className="text-2xl font-bold text-yellow-400 mb-6">
            예약 상담 신청
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                상담 날짜
              </label>
              <input
                type="date"
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                상담 시간
              </label>
              <select className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400">
                <option>09:00 - 10:00</option>
                <option>10:00 - 11:00</option>
                <option>14:00 - 15:00</option>
                <option>15:00 - 16:00</option>
                <option>16:00 - 17:00</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                상담 주제
              </label>
              <textarea
                placeholder="상담받고 싶은 내용을 입력하세요..."
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 h-24"
              />
            </div>
          </div>
          <Button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg">
            예약 신청하기
          </Button>
        </div>
      </div>
    </div>
  );
}
