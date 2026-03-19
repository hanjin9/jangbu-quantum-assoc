import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Calendar, CreditCard, LogOut, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

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

export default function Dashboard() {
  const { user: authUser, logout } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    try {
      // Mock subscription data
      setSubscription({
        id: 1,
        tier_id: 'gold',
        status: 'active',
        current_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Mock orders data
      setOrders([
        {
          id: 1,
          stripe_session_id: 'cs_test_123',
          tier_id: 'gold',
          amount: 99.99,
          status: 'completed',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancelSubscription = async () => {
    if (!window.confirm('구독을 취소하시겠습니까?')) return;

    try {
      toast.success('구독이 취소되었습니다');
    } catch (error) {
      toast.error('구독 취소 실패');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      toast.error('로그아웃 실패');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">대시보드</h1>
            <p className="text-gray-400">안녕하세요, {authUser?.name}님</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-800">
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
            <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-800" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="subscription" className="data-[state=active]:bg-amber-500">구독 정보</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500">주문 이력</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-amber-500">프로필</TabsTrigger>
          </TabsList>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {subscription ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">현재 구독</CardTitle>
                  <CardDescription>구독 상태 및 갱신 정보</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="text-white font-semibold">Gold 플랜</p>
                        <p className="text-sm text-gray-400">활성 상태</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-amber-500">$99.99</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">구독 시작일</p>
                      <p className="text-white font-semibold">
                        {new Date(subscription.current_period_start).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">다음 갱신일</p>
                      <p className="text-white font-semibold">
                        {new Date(subscription.current_period_end).toLocaleDateString('ko-KR')}
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
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <p className="text-white mb-4">현재 활성 구독이 없습니다</p>
                    <Button className="bg-amber-500 hover:bg-amber-600">
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
                  <Card key={order.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold mb-1">
                            {order.tier_id === 'gold' ? 'Gold 플랜' : 'Silver 플랜'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${order.amount}</p>
                          <p className="text-sm text-green-400">{order.status === 'completed' ? '완료' : '진행중'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <p className="text-center text-gray-400">주문 이력이 없습니다</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">프로필 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">이름</p>
                  <p className="text-white font-semibold">{authUser?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">이메일</p>
                  <p className="text-white font-semibold">{authUser?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">역할</p>
                  <p className="text-white font-semibold">{authUser?.role === 'admin' ? '관리자' : '일반 사용자'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">가입일</p>
                  <p className="text-white font-semibold">
                    {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('ko-KR') : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
