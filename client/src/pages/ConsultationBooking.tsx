import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ConsultationBooking() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!formData.name.trim()) {
      setError("성명을 입력해주세요.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("휴대폰 번호를 입력해주세요.");
      return;
    }

    // 휴대폰 번호 형식 검사 (010-0000-0000)
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("휴대폰 번호 형식이 올바르지 않습니다. (예: 010-0000-0000)");
      return;
    }

    // 상담 예약 데이터 저장
    console.log("상담 예약 데이터:", formData);

    // 성공 메시지
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", phone: "" });
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20">
      <div className="max-w-md mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-4">
            상담 예약
          </h1>
          <p className="text-gray-300">
            양자요법 전문가와 1:1 상담을 예약하세요.
          </p>
        </div>

        {/* 예약 폼 */}
        <div className="bg-slate-800 p-8 rounded-lg border border-yellow-400/20">
          {submitted && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
              <p className="text-green-300 font-semibold text-center">
                ✓ 상담 예약이 신청되었습니다!
              </p>
              <p className="text-green-300 text-sm text-center">
                담당자가 곧 연락드리겠습니다.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 성명 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                성명 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="이름을 입력하세요"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-lg"
              />
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                휴대폰 번호 *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="010-0000-0000"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-yellow-400/20 focus:outline-none focus:border-yellow-400 placeholder-gray-500 text-lg"
              />
              <p className="text-xs text-gray-400 mt-2">
                형식: 010-0000-0000
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg text-lg"
              >
                예약하기
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg text-lg"
              >
                취소
              </Button>
            </div>
          </form>
        </div>

        {/* 안내 텍스트 */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>상담 시간: 평일 09:00 ~ 18:00</p>
          <p>담당자가 입력하신 휴대폰 번호로 연락드립니다.</p>
        </div>
      </div>
    </div>
  );
}
