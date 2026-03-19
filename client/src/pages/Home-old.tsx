import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { ChevronRight, Calendar, BarChart3, Users, Heart, Zap, Award } from 'lucide-react';

// 고정된 히어로 이미지 URL (변경 금지)
const FIXED_HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-main-6jjXaiPbmoCJLUoUaD8J3L.webp';

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

      {/* Hero Section with FIXED Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${FIXED_HERO_IMAGE})`,
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            양자 에너지로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">건강을 회복하세요</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            전문 양자요법 관리사와 함께 신체의 에너지 밸런스를 회복하고 건강한 삶을 시작하세요
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
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
        </div>
      </section>

      {/* About Section with Image */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">전문 관리사 소개</h2>
            <p className="text-gray-300 mb-4 text-lg">
              국제 인증을 받은 전문 양자요법 관리사들이 여러분의 건강을 책임집니다. 
              각 관리사는 15년 이상의 경험을 보유하고 있으며, 개인 맞춤형 상담을 제공합니다.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500" />
                국제 인증 양자요법 전문가
              </li>
              <li className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-amber-500" />
                15년 이상의 임상 경험
              </li>
              <li className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-500" />
                개인 맞춤형 에너지 치유
              </li>
            </ul>
          </div>
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/about-practitioners-Z32UFGZ4froiVZzGms7oZy.webp"
              alt="전문 관리사"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services Section with Image */}
      <section className="bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">양자요법 서비스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/services-energy-healing-mesduqxKPanDzwZriWUpWz.webp"
                alt="양자요법 서비스"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">에너지 치유 프로그램</h3>
              <p className="text-gray-300 mb-6 text-lg">
                최첨단 양자 에너지 기술을 활용하여 신체의 에너지 흐름을 최적화합니다.
                개인의 건강 상태에 맞춰 맞춤형 치유 프로그램을 제공합니다.
              </p>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li>✓ 1:1 개인 상담 및 진단</li>
                <li>✓ 에너지 밸런싱 치료</li>
                <li>✓ 스트레스 해소 프로그램</li>
                <li>✓ 건강 증진 관리</li>
              </ul>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => setLocation('/appointments')}
              >
                상담 예약하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Section with Image */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">프리미엄 멤버십</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/membership-benefits-hvbgGJoVVoN5HMWZGosGRY.webp"
              alt="멤버십 혜택"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">독점 멤버십 혜택</h3>
            <div className="space-y-4 text-gray-300">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-amber-500/20">
                <h4 className="text-amber-400 font-bold mb-2">Silver Wellness</h4>
                <p>월 1회 상담 + 24/7 지원 + 온라인 커뮤니티</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-amber-500/20">
                <h4 className="text-amber-400 font-bold mb-2">Gold Wellness</h4>
                <p>월 2회 상담 + 맞춤형 프로그램 + 우선 예약</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-amber-500/20">
                <h4 className="text-amber-400 font-bold mb-2">Platinum Elite</h4>
                <p>월 4회 상담 + VIP 서비스 + 개인 관리사</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-amber-500/20">
                <h4 className="text-amber-400 font-bold mb-2">Diamond Quantum</h4>
                <p>무제한 상담 + 프리미엄 서비스 + 전용 라운지</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Image */}
      <section className="bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">고객 후기</h2>
          <div className="rounded-lg overflow-hidden shadow-2xl mb-12">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/testimonials-success-FxRZ89mghsSzwmi56YcTgf.webp"
              alt="고객 후기"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: '김민지',
                title: '마케팅 임원',
                testimonial: '양자요법을 통해 만성 스트레스가 완화되었고, 에너지가 회복되었습니다.'
              },
              {
                name: '이준호',
                title: '기업가',
                testimonial: '개인 맞춤형 상담으로 건강이 눈에 띄게 개선되었습니다. 강력히 추천합니다.'
              },
              {
                name: '박수진',
                title: '의료 전문가',
                testimonial: '과학적 접근과 전문성이 돋보이는 서비스입니다. 매우 만족합니다.'
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 bg-slate-700 border-amber-500/20">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.testimonial}"</p>
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-amber-400 text-sm">{testimonial.title}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section with Image */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">상담 예약</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/appointment-booking-mb5sd55Dqn6P9gnJxjvaWj.webp"
              alt="상담 예약"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">간편한 예약 시스템</h3>
            <p className="text-gray-300 mb-6 text-lg">
              온라인 캘린더를 통해 원하는 시간에 전문 관리사와의 상담을 예약하세요.
              모바일, 태블릿, 데스크톱 모든 기기에서 쉽게 이용 가능합니다.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-500" />
                24시간 온라인 예약
              </li>
              <li className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-500" />
                원하는 관리사 선택
              </li>
              <li className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                예약 현황 실시간 확인
              </li>
            </ul>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleAppointmentClick}
            >
              <Calendar className="w-5 h-5 mr-2" />
              지금 예약하기
            </Button>
          </div>
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
