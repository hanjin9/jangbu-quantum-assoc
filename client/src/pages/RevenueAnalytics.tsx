import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, BarChart3, PieChart, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface MonthlyRevenue {
  month: string;
  total: number;
  courses: number;
  memberships: number;
  consulting: number;
}

interface LectureRevenue {
  name: string;
  revenue: number;
  participants: number;
  revenuePerParticipant: number;
  trend: 'up' | 'down';
}

interface TierRevenue {
  tier: string;
  memberCount: number;
  monthlyRevenue: number;
  totalRevenue: number;
  percentage: number;
  color: string;
}

const monthlyRevenueData: MonthlyRevenue[] = [
  { month: '1월', total: 8500000, courses: 3200000, memberships: 4500000, consulting: 800000 },
  { month: '2월', total: 9200000, courses: 3500000, memberships: 4800000, consulting: 900000 },
  { month: '3월', total: 10500000, courses: 4200000, memberships: 5300000, consulting: 1000000 },
  { month: '4월', total: 11200000, courses: 4500000, memberships: 5700000, consulting: 1000000 },
  { month: '5월', total: 12345000, courses: 5100000, memberships: 6200000, consulting: 1045000 },
];

const lectureRevenueData: LectureRevenue[] = [
  { name: '기초 양자요법 입문', revenue: 2340000, participants: 234, revenuePerParticipant: 10000, trend: 'up' },
  { name: '고급 에너지 치유법', revenue: 1890000, participants: 189, revenuePerParticipant: 10000, trend: 'up' },
  { name: '양자 명상 마스터', revenue: 1560000, participants: 156, revenuePerParticipant: 10000, trend: 'down' },
  { name: '일상 양자요법 활용', revenue: 1420000, participants: 142, revenuePerParticipant: 10000, trend: 'up' },
  { name: '심화 양자 에너지', revenue: 1280000, participants: 128, revenuePerParticipant: 10000, trend: 'down' },
];

const tierRevenueData: TierRevenue[] = [
  { tier: '일반 회원', memberCount: 847, monthlyRevenue: 0, totalRevenue: 0, percentage: 0, color: 'bg-gray-500' },
  { tier: '전문가', memberCount: 350, monthlyRevenue: 34650000, totalRevenue: 173250000, percentage: 85, color: 'bg-yellow-500' },
  { tier: '협회장', memberCount: 50, monthlyRevenue: 6000000, totalRevenue: 30000000, percentage: 15, color: 'bg-yellow-600' },
];

export default function RevenueAnalytics() {
  const totalRevenue = monthlyRevenueData.reduce((sum, m) => sum + m.total, 0);
  const averageMonthlyRevenue = Math.floor(totalRevenue / monthlyRevenueData.length);
  const maxRevenue = Math.max(...monthlyRevenueData.map(m => m.total));
  const minRevenue = Math.min(...monthlyRevenueData.map(m => m.total));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">협회 수익 분석</h1>
          <p className="text-gray-400">수익 현황을 상세히 분석하세요</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-yellow-400/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">총 수익</p>
                  <p className="text-2xl font-bold text-white">₩{(totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500 mt-2">5개월 누계</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-yellow-400/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">월평균 수익</p>
                  <p className="text-2xl font-bold text-white">₩{(averageMonthlyRevenue / 1000000).toFixed(1)}M</p>
                  <Badge className="bg-green-500/20 text-green-300 mt-2">↑ 안정적</Badge>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-yellow-400/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">최고 월 수익</p>
                  <p className="text-2xl font-bold text-white">₩{(maxRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500 mt-2">5월</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-yellow-400/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">성장률</p>
                  <p className="text-2xl font-bold text-white">+45.1%</p>
                  <p className="text-xs text-gray-500 mt-2">1월 대비 5월</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue Trend */}
        <Card className="bg-slate-800 border-yellow-400/20 mb-8">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              월별 수익 추이
            </CardTitle>
            <CardDescription className="text-gray-400">수익 구성: 강의료(파랑), 멤버십(초록), 상담료(주황)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyRevenueData.map((data, idx) => {
                const maxTotal = Math.max(...monthlyRevenueData.map(m => m.total));
                const percentage = (data.total / maxTotal) * 100;
                
                return (
                  <div key={idx}>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-300 font-medium">{data.month}</span>
                      <span className="text-yellow-400 font-semibold">
                        ₩{(data.total / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    
                    {/* Stacked Bar Chart */}
                    <div className="flex h-8 rounded-full overflow-hidden bg-slate-700">
                      <div
                        className="bg-blue-500"
                        style={{ width: `${(data.courses / data.total) * 100}%` }}
                        title={`강의료: ₩${(data.courses / 1000000).toFixed(1)}M`}
                      />
                      <div
                        className="bg-green-500"
                        style={{ width: `${(data.memberships / data.total) * 100}%` }}
                        title={`멤버십: ₩${(data.memberships / 1000000).toFixed(1)}M`}
                      />
                      <div
                        className="bg-orange-500"
                        style={{ width: `${(data.consulting / data.total) * 100}%` }}
                        title={`상담료: ₩${(data.consulting / 1000000).toFixed(1)}M`}
                      />
                    </div>
                    
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span>강의: ₩{(data.courses / 1000000).toFixed(1)}M</span>
                      <span>멤버십: ₩{(data.memberships / 1000000).toFixed(1)}M</span>
                      <span>상담: ₩{(data.consulting / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Lecture */}
        <Card className="bg-slate-800 border-yellow-400/20 mb-8">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              강의별 수익 TOP 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">강의명</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">수강자</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">1인당 수익</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">총 수익</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">추세</th>
                  </tr>
                </thead>
                <tbody>
                  {lectureRevenueData.map((lecture, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{lecture.name}</td>
                      <td className="py-3 px-4 text-center text-gray-300">{lecture.participants}</td>
                      <td className="py-3 px-4 text-center text-yellow-400">₩{lecture.revenuePerParticipant.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-yellow-400 font-semibold">
                        ₩{(lecture.revenue / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          className={`${
                            lecture.trend === 'up'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {lecture.trend === 'up' ? '↑' : '↓'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Tier */}
        <Card className="bg-slate-800 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              등급별 수익 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {tierRevenueData.map((tier, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${tier.color} rounded-full`} />
                      <span className="text-gray-300 font-medium">{tier.tier}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-semibold">
                        ₩{(tier.monthlyRevenue / 1000000).toFixed(1)}M/월
                      </p>
                      <p className="text-gray-500 text-xs">
                        {tier.memberCount}명 ({tier.percentage}%)
                      </p>
                    </div>
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
    </div>
  );
}
