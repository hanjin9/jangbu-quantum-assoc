import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronRight, Calendar } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with FIXED Image */}
      <section className="relative h-screen md:h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-main-6jjXaiPbmoCJLUoUaD8J3L.webp)`,
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-3xl md:text-7xl font-bold text-white mb-4 md:mb-6">
            양자 에너지로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">건강을 회복하세요</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-8">
            전문 양자요법 관리사와 함께 신체의 에너지 밸런스를 회복하고 건강한 삶을 시작하세요
          </p>
          <div className="flex gap-2 md:gap-4 justify-center flex-wrap text-sm md:text-base flex-col md:flex-row">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 md:px-12 min-w-max"
              onClick={() => navigate('/sms-login')}
            >
              🔐 로그인
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 md:px-12 min-w-max"
              onClick={() => navigate('/checkout')}
            >
              📝 회원 가입
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              className="bg-amber-500/20 border-2 border-amber-500 text-amber-400 hover:bg-amber-500/40 hover:border-amber-400 transition-all duration-300 font-semibold md:ml-4"
              onClick={() => navigate('/consultation-booking')}
            >
              <Calendar className="w-5 h-5 mr-2" />
              상담 예약하기
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Image */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#1a4d7a]">고객 후기</h3>
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
              <div key={i} className="p-6 rounded-lg border border-border bg-card hover:border-[#d4af37] transition">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#d4af37]">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.testimonial}"</p>
                <p className="text-[#1a4d7a] font-bold">{testimonial.name}</p>
                <p className="text-[#d4af37] text-sm">{testimonial.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#1a4d7a]">{t('common.services')}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('community.title'), icon: '👥', path: '/community' },
              { title: t('exam.title'), icon: '📝', path: '/exam' },
              { title: t('certification.title'), icon: '🏆', path: '/verify-certificate' },
            ].map((feature, i) => (
              <button
                key={i}
                onClick={() => navigate(feature.path)}
                className="p-6 rounded-lg border border-border hover:border-[#d4af37] transition bg-card hover:bg-card/80 text-left"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-[#1a4d7a] mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{t('about.description')}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1a4d7a]/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 text-[#1a4d7a]">{t('hero.cta_membership')}</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('about.description')}
          </p>
          <Button 
            size="lg" 
            className="bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold"
            onClick={() => navigate('/checkout')}
          >
            {t('hero.cta_membership')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a4d7a] text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 {t('about.title')}. {t('common.contact')}: contact@jangbu.kr</p>
        </div>
      </footer>
    </div>
  );
}
