import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';

interface OrderData {
  id: number;
  userId: number;
  tierId: string;
  amount: string;
  status: string;
  createdAt: string;
}

interface SubscriptionData {
  id: number;
  userId: number;
  tierId: string;
  status: string;
  currentPeriodEnd: string;
}

interface EmailLogData {
  id: number;
  emailType: string;
  status: string;
  createdAt: string;
}

const COLORS = ['#1e3a8a', '#f59e0b', '#10b981', '#ef4444'];

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      return;
    }

    // TODO: Fetch data from API endpoints
    // For now, using mock data
    const mockOrders: OrderData[] = [
      { id: 1, userId: 1, tierId: 'gold', amount: '599.00', status: 'completed', createdAt: '2026-03-17' },
      { id: 2, userId: 2, tierId: 'silver', amount: '299.00', status: 'completed', createdAt: '2026-03-17' },
      { id: 3, userId: 3, tierId: 'platinum', amount: '999.00', status: 'pending', createdAt: '2026-03-18' },
    ];

    const mockSubscriptions: SubscriptionData[] = [
      { id: 1, userId: 1, tierId: 'gold', status: 'active', currentPeriodEnd: '2026-04-17' },
      { id: 2, userId: 2, tierId: 'silver', status: 'active', currentPeriodEnd: '2026-04-17' },
      { id: 3, userId: 3, tierId: 'platinum', status: 'paused', currentPeriodEnd: '2026-05-18' },
    ];

    const mockEmailLogs: EmailLogData[] = [
      { id: 1, emailType: 'payment_confirmation', status: 'sent', createdAt: '2026-03-17' },
      { id: 2, emailType: 'welcome', status: 'sent', createdAt: '2026-03-17' },
      { id: 3, emailType: 'subscription_renewal', status: 'failed', createdAt: '2026-03-18' },
    ];

    setOrders(mockOrders);
    setSubscriptions(mockSubscriptions);
    setEmailLogs(mockEmailLogs);
    setLoading(false);
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">접근 거부</h1>
          <p className="text-muted-foreground mb-6">관리자만 접근할 수 있습니다.</p>
          <Button onClick={() => window.location.href = '/'}>홈으로 돌아가기</Button>
        </Card>
      </div>
    );
  }

  const orderStats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + parseFloat(o.amount), 0)
  };

  const subscriptionStats = {
    active: subscriptions.filter(s => s.status === 'active').length,
    paused: subscriptions.filter(s => s.status === 'paused').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
  };

  const emailStats = {
    sent: emailLogs.filter(e => e.status === 'sent').length,
    failed: emailLogs.filter(e => e.status === 'failed').length,
    bounced: emailLogs.filter(e => e.status === 'bounced').length,
  };

  // 회원 관리 데이터
  const users = [
    { id: 1, name: '김민지', email: 'minzi@example.com', tier: 'Gold', joinDate: '2026-01-15', status: '활성' },
    { id: 2, name: '이준호', email: 'junho@example.com', tier: 'Platinum', joinDate: '2026-02-01', status: '활성' },
    { id: 3, name: '박수진', email: 'sujin@example.com', tier: 'Silver', joinDate: '2026-02-20', status: '활성' },
  ];

  // 게시물 관리 데이터
  const posts = [
    { id: 1, author: '김민지', title: '양자요법 초급 강의 후기', category: '후기', date: '2026-03-19', status: '승인' },
    { id: 2, author: '이준호', title: '에너지 진단법 질문있습니다', category: '질문', date: '2026-03-18', status: '승인' },
    { id: 3, author: '박수진', title: '신입 회원 인사드립니다', category: '소개', date: '2026-03-17', status: '대기' },
  ];

  // 결제 관리 데이터
  const payments = [
    { id: 1, user: '김민지', tier: 'Gold', amount: '₩59,900', date: '2026-03-15', status: '완료' },
    { id: 2, user: '이준호', tier: 'Platinum', amount: '₩99,900', date: '2026-03-10', status: '완료' },
    { id: 3, user: '박수진', tier: 'Silver', amount: '₩29,900', date: '2026-03-01', status: '완료' },
  ];

  const chartData = [
    { name: 'Silver', value: subscriptions.filter(s => s.tierId === 'silver').length },
    { name: 'Gold', value: subscriptions.filter(s => s.tierId === 'gold').length },
    { name: 'Platinum', value: subscriptions.filter(s => s.tierId === 'platinum').length },
    { name: 'Diamond', value: subscriptions.filter(s => s.tierId === 'diamond').length },
  ];

  const revenueData = [
    { month: '1월', revenue: 2500 },
    { month: '2월', revenue: 3200 },
    { month: '3월', revenue: 2800 },
    { month: '4월', revenue: 3900 },
    { month: '5월', revenue: 4200 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">관리자 대시보드</h1>
          <p className="text-muted-foreground">주문, 구독, 이메일 통계 및 모니터링</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-blue-600">
            <div className="text-sm text-muted-foreground mb-2">총 주문</div>
            <div className="text-3xl font-bold text-foreground">{orderStats.total}</div>
            <div className="text-xs text-green-600 mt-2">완료: {orderStats.completed}</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <div className="text-sm text-muted-foreground mb-2">총 수익</div>
            <div className="text-3xl font-bold text-foreground">${orderStats.revenue.toFixed(2)}</div>
            <div className="text-xs text-amber-600 mt-2">대기: {orderStats.pending}</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-600">
            <div className="text-sm text-muted-foreground mb-2">활성 구독</div>
            <div className="text-3xl font-bold text-foreground">{subscriptionStats.active}</div>
            <div className="text-xs text-green-600 mt-2">일시정지: {subscriptionStats.paused}</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-red-600">
            <div className="text-sm text-muted-foreground mb-2">이메일 발송</div>
            <div className="text-3xl font-bold text-foreground">{emailStats.sent}</div>
            <div className="text-xs text-red-600 mt-2">실패: {emailStats.failed}</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="orders">주문 관리</TabsTrigger>
            <TabsTrigger value="subscriptions">구독 모니터링</TabsTrigger>
            <TabsTrigger value="users">회원 관리</TabsTrigger>
            <TabsTrigger value="posts">게시물 관리</TabsTrigger>
            <TabsTrigger value="payments">결제 관리</TabsTrigger>
            <TabsTrigger value="analytics">분석</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">최근 주문</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">주문 ID</th>
                      <th className="pb-2 font-semibold">사용자 ID</th>
                      <th className="pb-2 font-semibold">플랜</th>
                      <th className="pb-2 font-semibold">금액</th>
                      <th className="pb-2 font-semibold">상태</th>
                      <th className="pb-2 font-semibold">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">#{order.id}</td>
                        <td className="py-3">{order.userId}</td>
                        <td className="py-3 capitalize">{order.tierId}</td>
                        <td className="py-3">${order.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'completed' ? '완료' : order.status === 'pending' ? '대기' : '실패'}
                          </span>
                        </td>
                        <td className="py-3">{order.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">구독 현황</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">구독 ID</th>
                      <th className="pb-2 font-semibold">사용자 ID</th>
                      <th className="pb-2 font-semibold">플랜</th>
                      <th className="pb-2 font-semibold">상태</th>
                      <th className="pb-2 font-semibold">갱신 예정일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map(sub => (
                      <tr key={sub.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">#{sub.id}</td>
                        <td className="py-3">{sub.userId}</td>
                        <td className="py-3 capitalize">{sub.tierId}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            sub.status === 'active' ? 'bg-green-100 text-green-800' :
                            sub.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sub.status === 'active' ? '활성' : sub.status === 'paused' ? '일시정지' : '취소'}
                          </span>
                        </td>
                        <td className="py-3">{sub.currentPeriodEnd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">회원 관리</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">이름</th>
                      <th className="pb-2 font-semibold">이메일</th>
                      <th className="pb-2 font-semibold">멤버십</th>
                      <th className="pb-2 font-semibold">가입일</th>
                      <th className="pb-2 font-semibold">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">{user.name}</td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3 capitalize">{user.tier}</td>
                        <td className="py-3">{user.joinDate}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.status === '활성' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Post Management Tab */}
          <TabsContent value="posts" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">게시물 관리</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">제목</th>
                      <th className="pb-2 font-semibold">작성자</th>
                      <th className="pb-2 font-semibold">카테고리</th>
                      <th className="pb-2 font-semibold">작성일</th>
                      <th className="pb-2 font-semibold">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">{post.title}</td>
                        <td className="py-3">{post.author}</td>
                        <td className="py-3">{post.category}</td>
                        <td className="py-3">{post.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            post.status === '승인' ? 'bg-green-100 text-green-800' :
                            post.status === '대기' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Payment Management Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">결제 관리</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">회원명</th>
                      <th className="pb-2 font-semibold">멤버십</th>
                      <th className="pb-2 font-semibold">금액</th>
                      <th className="pb-2 font-semibold">결제일</th>
                      <th className="pb-2 font-semibold">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">{payment.user}</td>
                        <td className="py-3 capitalize">{payment.tier}</td>
                        <td className="py-3">{payment.amount}</td>
                        <td className="py-3">{payment.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            payment.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Email Logs Tab */}
          <TabsContent value="emails" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">이메일 발송 로그</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">로그 ID</th>
                      <th className="pb-2 font-semibold">이메일 타입</th>
                      <th className="pb-2 font-semibold">상태</th>
                      <th className="pb-2 font-semibold">발송 시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">#{log.id}</td>
                        <td className="py-3 capitalize">{log.emailType.replace('_', ' ')}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            log.status === 'sent' ? 'bg-green-100 text-green-800' :
                            log.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.status === 'sent' ? '발송됨' : log.status === 'failed' ? '실패' : '반송'}
                          </span>
                        </td>
                        <td className="py-3">{log.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Subscription Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">플랜별 구독 분포</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Revenue Trend */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">월별 수익 추이</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Summary Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">주요 지표</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded">
                  <div className="text-sm text-muted-foreground mb-1">평균 주문 금액</div>
                  <div className="text-2xl font-bold">${(orderStats.revenue / orderStats.completed || 0).toFixed(2)}</div>
                </div>
                <div className="p-4 bg-muted rounded">
                  <div className="text-sm text-muted-foreground mb-1">구독 유지율</div>
                  <div className="text-2xl font-bold">{((subscriptionStats.active / subscriptions.length) * 100 || 0).toFixed(1)}%</div>
                </div>
                <div className="p-4 bg-muted rounded">
                  <div className="text-sm text-muted-foreground mb-1">이메일 성공률</div>
                  <div className="text-2xl font-bold">{((emailStats.sent / emailLogs.length) * 100 || 0).toFixed(1)}%</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
