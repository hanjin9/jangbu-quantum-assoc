import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Zap, Users, Shield } from 'lucide-react';

export default function WelcomePage() {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const features = [
    {
      icon: Zap,
      title: '양자요법 학습',
      description: '전문 강사진과 함께 양자요법의 기초부터 심화까지 배우세요.',
    },
    {
      icon: Users,
      title: '커뮤니티 참여',
      description: '같은 관심사를 가진 회원들과 경험을 나누고 네트워킹하세요.',
    },
    {
      icon: Shield,
      title: '자격증 취득',
      description: '협회 공인 자격증을 획득하고 전문가로 인정받으세요.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-in fade-in duration-500">
        {/* 메인 카드 */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <div className="p-8 md:p-12 text-center">
            {/* 성공 아이콘 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-r from-amber-400 to-amber-600 p-4 rounded-full animate-pulse">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              환영합니다!
            </h1>

            {/* 부제목 */}
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              장•부 양자요법 관리사 협회에 가입하셨습니다.
              <br />
              이제 전문가 커뮤니티의 일원이 되셨습니다.
            </p>

            {/* 설명 텍스트 */}
            <p className="text-base text-slate-400 mb-12 leading-relaxed">
              계정이 활성화되었습니다. 이제 모든 학습 자료, 커뮤니티, 그리고 자격증 프로그램에 접근할 수 있습니다.
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                대시보드로 이동
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300"
              >
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </Card>

        {/* 기능 하이라이트 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="animate-in fade-in duration-500" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                  <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gradient-to-br from-amber-400/20 to-amber-600/20 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* 하단 텍스트 */}
        <p className="text-center text-slate-500 text-sm mt-8">
          {countdown}초 후 자동으로 대시보드로 이동합니다...
        </p>
      </div>
    </div>
  );
}
