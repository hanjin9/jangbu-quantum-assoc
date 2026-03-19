import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Home() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section with Original Image */}
      <section 
        className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://cdn.manus.im/webdev-static-assets/hero-quantum-main.png)',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">{t('hero.title')}</h2>
          <p className="text-xl text-gray-100 mb-8">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold"
              onClick={() => navigate('/checkout')}
            >
              {t('hero.cta_membership')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
              onClick={() => navigate('/appointments')}
            >
              {t('hero.cta_appointment')}
            </Button>
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
