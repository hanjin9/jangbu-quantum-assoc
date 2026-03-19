import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLocation } from 'wouter';

export default function Home() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1a4d7a] to-[#d4af37] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">장•부</span>
            </div>
            <h1 className="text-xl font-bold text-[#1a4d7a]">{t('about.title')}</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="/" className="text-sm hover:text-[#d4af37] transition">{t('common.home')}</a>
            <a href="/about" className="text-sm hover:text-[#d4af37] transition">{t('common.about')}</a>
            <a href="/community" className="text-sm hover:text-[#d4af37] transition">{t('community.title')}</a>
            <a href="/livestream" className="text-sm hover:text-[#d4af37] transition">{t('livestream.title')}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[600px] bg-gradient-to-r from-[#1a4d7a]/80 to-[#d4af37]/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1a4d7a] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">{t('hero.title')}</h2>
          <p className="text-xl text-gray-100 mb-8">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold"
              onClick={() => navigate('/membership')}
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
              { title: t('community.title'), icon: '👥' },
              { title: t('exam.title'), icon: '📝' },
              { title: t('certification.title'), icon: '🏆' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg border border-border hover:border-[#d4af37] transition bg-card">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-[#1a4d7a] mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{t('about.description')}</p>
              </div>
            ))}
          </div>
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
