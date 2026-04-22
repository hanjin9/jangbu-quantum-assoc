import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, ShoppingBag, LogOut, CheckCircle2, AlertCircle, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface Subscription {
  id: number;
  tier_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
}

interface Order {
  id: number;
  stripe_session_id: string;
  tier_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export function MyPage() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    setDashboardLoading(true);
    try {
      // Mock subscription data
      setSubscription({
        id: 1,
        tier_id: "gold",
        status: "active",
        current_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Mock orders data
      setOrders([
        {
          id: 1,
          stripe_session_id: "cs_test_123",
          tier_id: "gold",
          amount: 99.99,
          status: "completed",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const handleCancelSubscription = async () => {
    if (!window.confirm("구독을 취소하시겠습니까?")) return;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
        {/* Tabs Navigation */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-200 border border-slate-300 grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#d4af37] text-slate-800">
              개인정보
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-[#d4af37] text-slate-800">
              구독정보
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#d4af37] text-slate-800">
              주문이력
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#d4af37] text-slate-800">
              설정
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
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
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {subscription ? (
              <Card className="border-[#d4af37]/20 shadow-lg">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="text-slate-900 font-semibold">Gold 플랜</p>
                          <p className="text-sm text-slate-600">활성 상태</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-[#d4af37]">$99.99</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 rounded-lg p-4">
                        <p className="text-xs text-slate-600 mb-1">구독 시작일</p>
                        <p className="text-slate-900 font-semibold">
                          {new Date(subscription.current_period_start).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <div className="bg-slate-100 rounded-lg p-4">
                        <p className="text-xs text-slate-600 mb-1">다음 갱신일</p>
                        <p className="text-slate-900 font-semibold">
                          {new Date(subscription.current_period_end).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleCancelSubscription}
                    >
                      구독 취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-[#d4af37]/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                    <p className="text-slate-900 mb-4">현재 활성 구독이 없습니다</p>
                    <Button className="bg-[#d4af37] hover:bg-[#c99f2e] text-black font-semibold">
                      멤버십 구매하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-[#d4af37]/20 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-slate-900">주문 #{order.id}</p>
                          <p className="text-sm text-slate-600">
                            {new Date(order.created_at).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-[#d4af37]">${order.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600 font-semibold">✓ {order.status}</span>
                        <Button variant="outline" size="sm" className="text-[#d4af37] border-[#d4af37]">
                          상세보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-[#d4af37]/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">주문 이력이 없습니다</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-[#d4af37]/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
                <CardTitle>설정</CardTitle>
                <CardDescription className="text-gray-300">계정 설정 및 환경설정</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate("/settings")}
                    className="w-full bg-[#d4af37] hover:bg-[#c99f2e] text-black font-semibold"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    전체 설정으로 이동
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-lg mt-6"
        >
          <LogOut className="w-5 h-5 mr-2" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
