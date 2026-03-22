import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Users, Zap } from 'lucide-react';

interface TierFeature {
  name: string;
  included: boolean;
}

interface MembershipTier {
  id: string;
  name: string;
  level: string;
  color: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  features: TierFeature[];
  isPopular?: boolean;
}

const tiers: MembershipTier[] = [
  {
    id: 'basic',
    name: '일반 회원',
    level: 'BASIC',
    color: 'bg-gray-500',
    price: '무료',
    description: '기본 양자요법 교육 및 커뮤니티 접근',
    icon: <Users className="w-6 h-6" />,
    features: [
      { name: '기본 양자요법 교육 과정', included: true },
      { name: '커뮤니티 게시판 접근', included: true },
      { name: '월 1회 무료 상담', included: true },
      { name: '라이브 강의 시청', included: false },
      { name: '수료증 발급', included: false },
      { name: '전문가 상담 무제한', included: false },
    ],
  },
  {
    id: 'professional',
    name: '전문가',
    level: 'PROFESSIONAL',
    color: 'bg-yellow-500',
    price: '₩99,000/월',
    description: '전문 양자요법 교육 및 강의 진행 권한',
    icon: <Zap className="w-6 h-6" />,
    isPopular: true,
    features: [
      { name: '전문 양자요법 고급 교육', included: true },
      { name: '라이브 강의 진행 권한', included: true },
      { name: '회원 상담 진행', included: true },
      { name: '월 무제한 상담', included: true },
      { name: '수료증 발급 권한', included: true },
      { name: '협회 이벤트 우선 참여', included: true },
    ],
  },
  {
    id: 'president',
    name: '협회장',
    level: 'PRESIDENT',
    color: 'bg-yellow-600',
    price: '초대제',
    description: '협회 전체 관리 및 운영 권한',
    icon: <Crown className="w-6 h-6" />,
    features: [
      { name: '회원 관리 및 승인', included: true },
      { name: '강의 및 이벤트 관리', included: true },
      { name: '통계 및 분석 대시보드', included: true },
      { name: '결제 및 수익 관리', included: true },
      { name: '협회 공지사항 발송', included: true },
      { name: '시스템 설정 관리', included: true },
    ],
  },
];

export default function MembershipTiers() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">회원 등급 시스템</h1>
          <p className="text-gray-400 text-lg">
            귀하의 필요에 맞는 완벽한 등급을 선택하세요
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`bg-slate-800 border-yellow-400/20 relative overflow-hidden transition-all hover:border-yellow-400/50 ${
                tier.isPopular ? 'md:scale-105 ring-2 ring-yellow-400' : ''
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 px-4 py-1 text-sm font-semibold">
                  인기
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${tier.color} rounded-lg flex items-center justify-center text-white`}>
                    {tier.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white">{tier.name}</CardTitle>
                    <Badge variant="secondary" className="bg-slate-700 text-yellow-300 mt-1">
                      {tier.level}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-300">{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center py-4 border-y border-slate-700">
                  <p className="text-3xl font-bold text-yellow-400">{tier.price}</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 border border-slate-600 rounded flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-300' : 'text-gray-500 line-through'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    tier.isPopular
                      ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-500'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {tier.id === 'president' ? '문의하기' : '선택하기'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="bg-slate-800 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-yellow-400">등급별 기능 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">기능</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">일반 회원</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">전문가</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">협회장</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    '교육 과정 접근',
                    '라이브 강의 시청',
                    '라이브 강의 진행',
                    '상담 예약',
                    '수료증 발급',
                    '회원 관리',
                    '통계 대시보드',
                    '시스템 설정',
                  ].map((feature, idx) => (
                    <tr key={idx} className="border-b border-slate-700">
                      <td className="py-3 px-4 text-gray-300">{feature}</td>
                      <td className="py-3 px-4 text-center">
                        {idx < 2 && <Check className="w-5 h-5 text-green-400 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {idx < 6 && <Check className="w-5 h-5 text-green-400 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
