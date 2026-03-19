import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Calendar, CreditCard, LogOut, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user info
      const userRes = await fetch('/api/user/profile');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      // Fetch subscription
      const subRes = await fetch('/api/stripe/subscription');
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
      }

      // Fetch orders
      const ordersRes = await fetch('/api/stripe/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('구독을 취소하시겠습니까?')) return;

    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST'
      });

      if (res.ok) {
        toast.success('구독이 취소되었습니다');
        fetchDashboardData();
      } else {
        toast.error('구독 취소 실패');
      }
    } catch (error) {
      toast.error('오류가 발생했습니다');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">마이 대시보드</h1>
          <p className="text-foreground/70">구독 관리 및 주문 이력</p>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="subscription">구독</TabsTrigger>
            <TabsTrigger value="orders">주문 이력</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {subscription ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Subscription */}
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500" size={24} />
                      현재 구독
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">플랜</p>
                      <p className="text-2xl font-bold text-accent capitalize">
                        {subscription.tier_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">상태</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-semibold capitalize">
                          {subscription.status === 'active' ? '활성' : subscription.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">구독 기간</p>
                      <p className="text-sm">
                        {new Date(subscription.current_period_start).toLocaleDateString('ko-KR')} ~ {new Date(subscription.current_period_end).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleCancelSubscription}
                    >
                      구독 취소
                    </Button>
                  </CardContent>
                </Card>

                {/* Subscription Benefits */}
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle>포함된 혜택</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {subscription.tier_id === 'silver' && (
                        <>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>기본 양자 치료 세션</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>월간 뉴스레터</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>커뮤니티 접근</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>이메일 지원</span>
                          </li>
                        </>
                      )}
                      {subscription.tier_id === 'gold' && (
                        <>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>우선 양자 치료 세션</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>개인 맞춤형 계획</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>월간 1:1 상담</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>우선 지원</span>
                          </li>
                        </>
                      )}
                      {subscription.tier_id === 'platinum' && (
                        <>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>무제한 양자 치료 세션</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>VIP 라운지 접근</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>주간 상담 통화</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>24/7 우선 지원</span>
                          </li>
                        </>
                      )}
                      {subscription.tier_id === 'diamond' && (
                        <>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>모든 플래티넘 혜택</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>독점 연구 접근</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>전담 웰니스 매니저</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-accent" />
                            <span>연간 웰니스 리트릿</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="card-luxury">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto mb-4 text-amber-500" size={48} />
                    <p className="text-foreground/70 mb-4">현재 활성 구독이 없습니다</p>
                    <Button className="btn-accent">
                      멤버십 구독하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="card-luxury">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-5 gap-4 items-center">
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">주문 ID</p>
                          <p className="font-mono text-sm">{order.stripe_session_id.slice(0, 20)}...</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">플랜</p>
                          <p className="font-semibold capitalize">{order.tier_id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">금액</p>
                          <p className="font-semibold text-accent">${order.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">날짜</p>
                          <p className="text-sm">{new Date(order.created_at).toLocaleDateString('ko-KR')}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-semibold capitalize">
                              {order.status === 'completed' ? '완료' : order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-luxury">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto mb-4 text-foreground/30" size={48} />
                    <p className="text-foreground/70">주문 이력이 없습니다</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle>계정 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">이메일</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">이름</p>
                    <p className="font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">가입일</p>
                    <p className="text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings size={16} className="mr-2" />
                    프로필 편집
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard size={16} className="mr-2" />
                    결제 방법 관리
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
