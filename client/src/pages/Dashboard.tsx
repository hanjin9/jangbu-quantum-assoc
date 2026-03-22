import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Calendar, CreditCard, LogOut, Settings, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

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
  const [, navigate] = useLocation();
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
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-300 border-gray-600 hover:bg-gray-800 cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
            <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-800" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>

        {/* Dashboard Hero Image Section */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img 
            src="https://cdn.manus.im/webdev-static-assets/membership-benefits.png" 
            alt="Dashboard Hero"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="bg-slate-700 border border-slate-600 grid w-full grid-cols-4">
            <TabsTrigger value="subscription" className="data-[state=active]:bg-amber-500 text-gray-200">구독 정보</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500 text-gray-200">주문 이력</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-amber-500 text-gray-200">프로필</TabsTrigger>
            <TabsTrigger value="exam" className="data-[state=active]:bg-amber-500 text-gray-200">실기시험</TabsTrigger>
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

          {/* Exam Tab - 전체 실기 시험 화면 */}
          <TabsContent value="exam" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  실기 시험 센터
                </CardTitle>
                <CardDescription>양자요법 관리사 자격 시험</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 시험 과정 카드 */}
                  <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer" onClick={() => navigate('/exam')}>
                    <div className="text-3xl mb-3">📚</div>
                    <h3 className="text-white font-bold mb-2">양자요법 기초</h3>
                    <p className="text-sm text-gray-400 mb-4">양자에너지 치유의 기본 원리를 배웁니다.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">3문제</span>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">응시하기</Button>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer" onClick={() => navigate('/exam')}>
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="text-white font-bold mb-2">에너지 진단법</h3>
                    <p className="text-sm text-gray-400 mb-4">환자의 에너지 상태를 진단하는 방법을 학습합니다.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">3문제</span>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">응시하기</Button>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer" onClick={() => navigate('/exam')}>
                    <div className="text-3xl mb-3">🔬</div>
                    <h3 className="text-white font-bold mb-2">치료 기법 심화</h3>
                    <p className="text-sm text-gray-400 mb-4">고급 양자 치료 기법을 습득합니다.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">3문제</span>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">응시하기</Button>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer" onClick={() => navigate('/exam')}>
                    <div className="text-3xl mb-3">⚖️</div>
                    <h3 className="text-white font-bold mb-2">윤리 및 전문성</h3>
                    <p className="text-sm text-gray-400 mb-4">전문가로서의 윤리와 책임을 학습합니다.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">3문제</span>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">응시하기</Button>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer" onClick={() => navigate('/exam')}>
                    <div className="text-3xl mb-3">🏥</div>
                    <h3 className="text-white font-bold mb-2">임상 실습</h3>
                    <p className="text-sm text-gray-400 mb-4">실제 임상 사례를 통한 실습입니다.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">3문제</span>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">응시하기</Button>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer" onClick={() => navigate('/exam')}>
                    <div className="text-3xl mb-3">🎓</div>
                    <h3 className="text-white font-bold mb-2">자격증 종합 시험</h3>
                    <p className="text-sm text-gray-400 mb-4">모든 과정을 통합한 최종 시험입니다.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">3문제</span>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">응시하기</Button>
                    </div>
                  </div>
                </div>

                {/* 시험 안내 */}
                <div className="bg-slate-700 rounded-lg p-4 border border-amber-500/30">
                  <h4 className="text-white font-bold mb-2">시험 정보</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 각 과정당 3문제 출제</li>
                    <li>• 60점 이상 합격</li>
                    <li>• 합격 시 온라인 수료증 발급</li>
                    <li>• 언제든지 재응시 가능</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
