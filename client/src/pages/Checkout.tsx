import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState('gold');
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'silver',
      name: 'Silver Wellness',
      price: 29900,
      priceDisplay: '₩29,900',
      period: '/월',
      features: [
        '월 1회 상담',
        '24/7 이메일 지원',
        '온라인 커뮤니티 접근',
        '기본 학습 자료',
      ],
      color: 'from-slate-400 to-slate-600'
    },
    {
      id: 'gold',
      name: 'Gold Premium',
      price: 59900,
      priceDisplay: '₩59,900',
      period: '/월',
      features: [
        '월 4회 상담',
        '우선 지원 (24시간)',
        '프리미엄 커뮤니티',
        '모든 학습 자료',
        '개인 맞춤 프로그램',
      ],
      color: 'from-amber-400 to-amber-600',
      popular: true
    },
    {
      id: 'platinum',
      name: 'Platinum Elite',
      price: 99900,
      priceDisplay: '₩99,900',
      period: '/월',
      features: [
        '무제한 상담',
        'VIP 지원 (1시간)',
        '전용 커뮤니티',
        '심화 교육 과정',
        '개인 멘토링',
        '월간 워크숍',
      ],
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'diamond',
      name: 'Diamond Master',
      price: 199900,
      priceDisplay: '₩199,900',
      period: '/월',
      features: [
        '무제한 상담 + 비디오',
        '전담 매니저',
        '마스터 커뮤니티',
        '최고 수준 교육',
        '1:1 전문가 멘토링',
        '월간 마스터 세미나',
        '자격증 발급 지원',
      ],
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const handleCheckout = async (tierId: string) => {
    if (!isAuthenticated) {
      toast.error('로그인 후 이용해주세요');
      return;
    }

    setProcessingTier(tierId);
    setLoading(true);

    try {
      const tier = tiers.find(t => t.id === tierId);
      if (!tier) throw new Error('Invalid tier');

      // Stripe 결제 세션 생성
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId,
          tierName: tier.name,
          amount: tier.price,
          userEmail: user?.email,
          userId: user?.id,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Checkout failed');
      }

      const { checkoutUrl } = await response.json();
      
      // 새 탭에서 Stripe 결제 페이지 열기
      window.open(checkoutUrl, '_blank');
      toast.success(`${tier.name} 결제 페이지로 이동합니다`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : '결제 페이지 생성에 실패했습니다');
    } finally {
      setLoading(false);
      setProcessingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            멤버십 선택
          </h1>
          <p className="text-xl text-gray-300">
            당신의 양자요법 여정을 시작하세요
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`bg-slate-800/50 border-amber-500/20 hover:border-amber-500 transition cursor-pointer relative overflow-hidden ${
                selectedTier === tier.id ? 'ring-2 ring-amber-500' : ''
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-1 text-xs font-bold">
                  인기
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-white">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-amber-400">{tier.priceDisplay}</span>
                  <span className="text-gray-400 ml-2">{tier.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full bg-gradient-to-r ${tier.color} text-white hover:opacity-90 font-bold py-3`}
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loading && processingTier === tier.id}
                >
                  {loading && processingTier === tier.id ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      처리 중...
                    </>
                  ) : (
                    '선택하기'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Info */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-amber-400" />
                안전한 결제 보장
              </CardTitle>
              <CardDescription className="text-gray-300">
                Stripe를 통한 국제 수준의 보안 결제 처리
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">256-bit SSL 암호화</p>
                    <p className="text-sm text-gray-400">모든 거래 정보 암호화</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">PCI DSS 준수</p>
                    <p className="text-sm text-gray-400">국제 보안 기준 준수</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">언제든 취소 가능</p>
                    <p className="text-sm text-gray-400">위험 없는 구독</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">언제부터 결제가 시작되나요?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                결제 완료 후 즉시 서비스를 이용할 수 있습니다. 월간 구독의 경우 매월 같은 날짜에 자동 갱신됩니다.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">구독을 취소할 수 있나요?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                네, 언제든지 구독을 취소할 수 있습니다. 취소 후 현재 결제 기간이 끝날 때까지 서비스를 이용할 수 있습니다.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">환불이 가능한가요?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                구독 취소 후 환불은 결제 기간에 따라 처리됩니다. 자세한 내용은 고객 지원팀에 문의해주세요.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
