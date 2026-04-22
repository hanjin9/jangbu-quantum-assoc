import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface Message {
  id: string;
  sender: "user" | "consultant";
  content: string;
  timestamp: Date;
  senderName: string;
}

const consultantResponses: { [key: string]: string } = {
  "안녕": "안녕하세요! 양자요법 전문 상담사입니다. 건강 관련 어떤 도움이 필요하신가요?",
  "피로": "만성 피로는 양자요법으로 3개월 내 90% 이상 회복 가능합니다. 세포 에너지 활성화를 통해 에너지 수준을 정상화시켜드립니다.",
  "통증": "만성 통증은 혈액순환 개선으로 85% 이상 감소 가능합니다. 원적외선 공명 현상을 이용한 맞춤형 치료를 제공합니다.",
  "면역": "체온 상승을 통한 면역력 강화로 감기 빈도를 70% 감소시킬 수 있습니다. 양자 에너지 치료가 효과적입니다.",
  "스트레스": "432Hz 자연 주파수와 영점장 공명을 통해 스트레스를 80% 감소시킬 수 있습니다. 심층 이완으로 자율신경을 회복시킵니다.",
  "가격": "기본 멤버십부터 엘리트 멤버십까지 4가지 티어가 있습니다. 각 티어별 상담 횟수와 교육 시간이 다릅니다. 자세한 내용은 멤버십 페이지를 참고해주세요.",
  "교육": "양자요법 전문가 자격증 과정은 6개월 이상 진행되며, 온라인과 오프라인 교육이 병행됩니다. 국제 수준의 자격 관리를 제공합니다.",
  "예약": "상담 예약은 평일 09:00 ~ 18:00에 가능합니다. 아래 예약 폼에서 원하시는 날짜와 시간을 선택하시면 됩니다.",
  "기본": "궁금하신 점을 더 자세히 말씀해주시면 더 정확한 답변을 드릴 수 있습니다. 어떤 건강 문제가 있으신가요?",
};

export default function ChatConsultation() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("사용자");
  const [consultationData, setConsultationData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 초기 환영 메시지
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "consultant",
      content: "안녕하세요! 양자요법 전문 상담사입니다. 건강 관련 어떤 도움이 필요하신가요?",
      timestamp: new Date(),
      senderName: "양자요법 상담사",
    };
    setMessages([welcomeMessage]);
    setTimeout(() => setIsConnected(true), 1000);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getConsultantResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(consultantResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    return consultantResponses["기본"];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date(),
      senderName: userName,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // 상담사 자동 응답 (1.5초 후)
    setTimeout(() => {
      const consultantResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "consultant",
        content: getConsultantResponse(inputValue),
        timestamp: new Date(),
        senderName: "양자요법 상담사",
      };
      setMessages((prev) => [...prev, consultantResponse]);
    }, 1500);
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
              <h2 className="text-lg font-bold text-yellow-400">상담사 연결</h2>
              <p className="text-sm text-gray-400">
                {isConnected ? "✓ 상담사 연결됨" : "상담사 연결 중..."}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"} ${!isConnected && "animate-pulse"}`}></div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          <p className="text-gray-300 mb-6">
            1:1 맞춤형 상담으로 개인의 건강 상태에 맞는 양자요법 치료 계획을 수립해드립니다.
          </p>
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
                <option>11:00 - 12:00</option>
                <option>14:00 - 15:00</option>
                <option>15:00 - 16:00</option>
                <option>16:00 - 17:00</option>
                <option>17:00 - 18:00</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                상담 주제 (선택사항)
              </label>
              <select className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 mb-4">
                <option>만성 피로</option>
                <option>만성 통증</option>
                <option>면역력 강화</option>
                <option>스트레스 관리</option>
                <option>피부 건강</option>
                <option>기타</option>
              </select>
              <textarea
                placeholder="상담받고 싶은 내용을 자세히 입력하세요..."
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 h-24"
              />
            </div>
          </div>
          <Button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg">
            예약 신청하기
          </Button>
        </div>

        {/* FAQ 섹션 */}
        <div className="mt-12 bg-slate-800 p-8 rounded-lg border border-yellow-400/20">
          <h3 className="text-2xl font-bold text-yellow-400 mb-6">
            자주 묻는 질문
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="font-semibold text-yellow-400 mb-2">Q. 양자요법은 얼마나 효과가 있나요?</p>
              <p className="text-gray-300">A. 개인차가 있지만, 만성 피로는 3개월 내 90% 회복, 통증은 85% 감소, 스트레스는 80% 감소 등의 효과가 보고되고 있습니다.</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="font-semibold text-yellow-400 mb-2">Q. 상담은 몇 번 받을 수 있나요?</p>
              <p className="text-gray-300">A. 멤버십 티어에 따라 월 1회~4회 상담이 가능합니다. 기본 멤버십은 월 1회, 프리미엄은 월 2회, VIP는 월 3회, 엘리트는 무제한입니다.</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="font-semibold text-yellow-400 mb-2">Q. 부작용이 있나요?</p>
              <p className="text-gray-300">A. 양자요법은 인체의 자연 치유력을 높이는 방식이므로 부작용이 거의 없습니다. 다만 개인의 건강 상태에 따라 상담사와 상의하시는 것이 좋습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
