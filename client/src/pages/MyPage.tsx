import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CreditCard, ShoppingBag, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export function MyPage() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">로그인이 필요합니다.</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
          <p className="text-gray-300">개인정보, 구독, 주문이력을 관리하세요</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <Card className="mb-6 border-[#d4af37]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-[#d4af37]" />
              <div>
                <CardTitle>개인정보</CardTitle>
                <CardDescription className="text-gray-300">계정 정보 및 프로필</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">이름</label>
                  <p className="text-lg text-slate-900 mt-1">{user.name || "미설정"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">이메일</label>
                  <p className="text-lg text-slate-900 mt-1">{user.email || "미설정"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">로그인 방식</label>
                  <p className="text-lg text-slate-900 mt-1">{user.loginMethod || "미설정"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">가입일</label>
                  <p className="text-lg text-slate-900 mt-1">
                    {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/settings")}
                className="w-full bg-[#d4af37] hover:bg-[#c99f2e] text-black font-semibold"
              >
                개인정보 수정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Section */}
        <Card className="mb-6 border-[#d4af37]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-[#d4af37]" />
              <div>
                <CardTitle>구독정보</CardTitle>
                <CardDescription className="text-gray-300">현재 구독 상태 및 플랜</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600">구독 상태</label>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    활성
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600">현재 플랜</label>
                <p className="text-lg text-slate-900 mt-1">프리미엄 플랜</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600">갱신일</label>
                <p className="text-lg text-slate-900 mt-1">2026년 5월 22일</p>
              </div>
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-[#d4af37] hover:bg-[#c99f2e] text-black font-semibold"
              >
                구독 관리
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order History Section */}
        <Card className="mb-6 border-[#d4af37]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
              <div>
                <CardTitle>주문이력</CardTitle>
                <CardDescription className="text-gray-300">최근 주문 내역</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {/* Sample Order Items */}
              <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">양자요법 기초 과정</p>
                    <p className="text-sm text-slate-600">2026년 3월 15일</p>
                  </div>
                  <span className="text-lg font-bold text-[#d4af37]">₩99,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 font-semibold">✓ 결제완료</span>
                  <Button variant="outline" size="sm" className="text-[#d4af37] border-[#d4af37]">
                    상세보기
                  </Button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">프리미엄 멤버십 (1년)</p>
                    <p className="text-sm text-slate-600">2026년 2월 22일</p>
                  </div>
                  <span className="text-lg font-bold text-[#d4af37]">₩299,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 font-semibold">✓ 결제완료</span>
                  <Button variant="outline" size="sm" className="text-[#d4af37] border-[#d4af37]">
                    상세보기
                  </Button>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full mt-4 bg-[#d4af37] hover:bg-[#c99f2e] text-black font-semibold"
            >
              전체 주문 보기
            </Button>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
