import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { ChevronRight, Calendar, BarChart3, Users, Heart, Zap, Award } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleAppointmentClick = () => {
    if (isAuthenticated) {
      setLocation('/appointments');
    } else {
      window.location.href = '/';
    }
  };

  const handleAdminClick = () => {
    if (user?.role === 'admin') {
      setLocation('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">장•부</span>
            </div>
            <span className="text-white font-bold text-lg">양자요법 관리사 협회</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-amber-400"
                  onClick={() => setLocation('/dashboard')}
                >
                  대시보드
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-amber-400"
                  onClick={handleAppointmentClick}
                >
                  상담 예약
                </Button>
                {user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    className="text-white hover:text-amber-400"
                    onClick={handleAdminClick}
                  >
                    관리자 패널
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          양자 에너지로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">건강을 회복하세요</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          전문 양자요법 관리사와 함께 신체의 에너지 밸런스를 회복하고 건강한 삶을 시작하세요
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8"
            onClick={() => setLocation('/checkout')}
          >
            멤버십 가입하기
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
            onClick={handleAppointmentClick}
          >
            <Calendar className="w-5 h-5 mr-2" />
            상담 예약하기
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">우리의 서비스</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: '개인 맞춤 상담', desc: '전문가의 1:1 상담으로 개인 맞춤형 양자요법 프로그램 제공' },
            { icon: Zap, title: '에너지 치유', desc: '신체의 에너지 흐름을 최적화하여 건강 회복 촉진' },
            { icon: Award, title: '인증된 전문가', desc: '국제 인증 양자요법 관리사들의 전문적인 서비스' }
          ].map((feature, i) => (
            <Card key={i} className="p-6 bg-slate-800 border-amber-500/20 hover:border-amber-500/50 transition">
              <feature.icon className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Membership Plans */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">멤버십 플랜</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Silver', price: '$299', color: 'from-gray-400 to-gray-600' },
            { name: 'Gold', price: '$599', color: 'from-amber-400 to-amber-600', featured: true },
            { name: 'Platinum', price: '$999', color: 'from-slate-300 to-slate-500' },
            { name: 'Diamond', price: '$1,999', color: 'from-cyan-400 to-blue-600' }
          ].map((plan, i) => (
            <Card
              key={i}
              className={`p-6 transition ${
                plan.featured
                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-2 border-amber-500 scale-105'
                  : 'bg-slate-800 border-amber-500/20'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                {plan.name}
              </h3>
              <p className="text-3xl font-bold text-white mb-6">{plan.price}</p>
              <ul className="space-y-2 mb-6 text-gray-300">
                <li>✓ 월 {i + 1}회 상담</li>
                <li>✓ 24/7 지원</li>
                <li>✓ 맞춤형 프로그램</li>
                <li>✓ 온라인 커뮤니티</li>
              </ul>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => setLocation('/checkout')}
              >
                선택하기
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">지금 바로 시작하세요</h2>
          <p className="text-lg text-white/90 mb-8">
            전문 양자요법 관리사와의 상담을 통해 건강한 삶을 시작하세요
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-600 hover:bg-gray-100"
            onClick={handleAppointmentClick}
          >
            <Calendar className="w-5 h-5 mr-2" />
            상담 예약하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-amber-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">장•부 협회</h3>
              <p className="text-gray-400 text-sm">양자요법을 통한 건강한 삶의 실현</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">빠른 링크</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-amber-400">홈</a></li>
                <li><a href="/about" className="hover:text-amber-400">소개</a></li>
                <li><a href="/appointments" className="hover:text-amber-400">상담 예약</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-amber-400">FAQ</a></li>
                <li><a href="#" className="hover:text-amber-400">문의</a></li>
                <li><a href="#" className="hover:text-amber-400">약관</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">연락처</h4>
              <p className="text-gray-400 text-sm">
                Email: info@jangbu-assoc.com<br />
                Phone: +82-10-1234-5678
              </p>
            </div>
          </div>
          <div className="border-t border-amber-500/20 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 장•부 양자요법 관리사 협회. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
