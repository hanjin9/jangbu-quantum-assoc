import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, PieChart, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const stats: StatCard[] = [
  {
    label: '총 회원 수',
    value: '1,247',
    change: '+12.5%',
    icon: <Users className="w-6 h-6" />,
    trend: 'up',
  },
  {
    label: '이달 수익',
    value: '₩12,345,000',
    change: '+8.2%',
    icon: <DollarSign className="w-6 h-6" />,
    trend: 'up',
  },
  {
    label: '활성 강의',
    value: '23',
    change: '+3',
    icon: <Calendar className="w-6 h-6" />,
    trend: 'up',
  },
  {
    label: '평균 만족도',
    value: '4.8/5.0',
    change: '+0.2',
    icon: <TrendingUp className="w-6 h-6" />,
    trend: 'up',
  },
];

interface MemberData {
  tier: string;
  count: number;
  percentage: number;
  color: string;
}

const membersByTier: MemberData[] = [
  { tier: '일반 회원', count: 847, percentage: 68, color: 'bg-gray-500' },
  { tier: '전문가', count: 350, percentage: 28, color: 'bg-yellow-500' },
  { tier: '협회장', count: 50, percentage: 4, color: 'bg-yellow-600' },
];

interface RevenueData {
  month: string;
  amount: number;
}

const revenueData: RevenueData[] = [
  { month: '1월', amount: 8500000 },
  { month: '2월', amount: 9200000 },
  { month: '3월', amount: 10500000 },
  { month: '4월', amount: 11200000 },
  { month: '5월', amount: 12345000 },
];

interface LectureData {
  name: string;
  participants: number;
  rating: number;
  revenue: string;
}

const topLectures: LectureData[] = [
  { name: '기초 양자요법 입문', participants: 234, rating: 4.9, revenue: '₩2,340,000' },
  { name: '고급 에너지 치유법', participants: 189, rating: 4.8, revenue: '₩1,890,000' },
  { name: '양자 명상 마스터', participants: 156, rating: 4.7, revenue: '₩1,560,000' },
  { name: '일상 양자요법 활용', participants: 142, rating: 4.6, revenue: '₩1,420,000' },
];

export default function AdminStatsDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">협회 통계 대시보드</h1>
          <p className="text-gray-400">협회 운영 현황을 한눈에 확인하세요</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-slate-800 border-yellow-400/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                    <Badge
                      className={`${
                        stat.trend === 'up'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center text-yellow-400">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="bg-slate-800 border-yellow-400/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                월별 수익 추이
              </CardTitle>
              <CardDescription className="text-gray-400">지난 5개월 수익 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.map((data, idx) => {
                  const maxAmount = Math.max(...revenueData.map(d => d.amount));
                  const percentage = (data.amount / maxAmount) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300 font-medium">{data.month}</span>
                        <span className="text-yellow-400 font-semibold">
                          ₩{(data.amount / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Members by Tier */}
          <Card className="bg-slate-800 border-yellow-400/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                등급별 회원 분포
              </CardTitle>
              <CardDescription className="text-gray-400">총 {membersByTier.reduce((sum, m) => sum + m.count, 0)}명</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {membersByTier.map((tier, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 font-medium">{tier.tier}</span>
                      <span className="text-yellow-400 font-semibold">{tier.count}명 ({tier.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${tier.color} h-full rounded-full`}
                        style={{ width: `${tier.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Lectures */}
        <Card className="bg-slate-800 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              인기 강의 TOP 4
            </CardTitle>
            <CardDescription className="text-gray-400">수강자 수 기준</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">강의명</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">수강자</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">평점</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">수익</th>
                  </tr>
                </thead>
                <tbody>
                  {topLectures.map((lecture, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{lecture.name}</td>
                      <td className="py-3 px-4 text-center text-gray-300">{lecture.participants}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          ★ {lecture.rating}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-yellow-400 font-semibold">
                        {lecture.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-slate-800 border-yellow-400/20 mt-8">
          <CardHeader>
            <CardTitle className="text-yellow-400">최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: '새 회원 가입', user: '김민준', time: '2시간 전', type: 'signup' },
                { action: '강의 완료', user: '이영희', time: '4시간 전', type: 'lecture' },
                { action: '상담 예약', user: '박준호', time: '6시간 전', type: 'appointment' },
                { action: '결제 완료', user: '최혜진', time: '8시간 전', type: 'payment' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-gray-300 font-medium">{activity.action}</p>
                    <p className="text-gray-500 text-sm">{activity.user}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
