import { useLocation } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export function GlobalHeader() {
  const [location, navigate] = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 페이지 전환 시 스크롤 리셋
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);

  // 스크롤 위치에 따라 "맨 위로" 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: t('common.home'), path: '/' },
    { label: t('common.about'), path: '/about' },
    { label: '아카데미', path: '/academy' },
    { label: t('community.title'), path: '/community' },
    { label: t('livestream.title'), path: '/livestream' },
    { label: t('common.dashboard'), path: '/dashboard' },
  ];

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
    // 홈페이지 맨 상단으로 스크롤
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border safe-top">
      <div className="w-full px-0 py-2 md:py-4">
        <div className="flex justify-between items-center px-4 md:px-6 gap-4 md:gap-8">
          {/* Logo - 좌측 끝에 붙임 */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-1 md:gap-2 hover:opacity-80 transition-opacity flex-shrink-0 active:scale-95"
            title={t('about.title')}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#1a4d7a] to-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs md:text-sm">장•부</span>
            </div>
            <h1 className="text-sm md:text-lg font-bold text-[#1a4d7a] hidden sm:inline whitespace-nowrap">
              {t('about.title')}
            </h1>
          </button>

          {/* Desktop Navigation - 중앙 정렬, 여유있는 간격 */}
          <nav className="hidden md:flex gap-8 items-center flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#d4af37] font-semibold border-b-2 border-[#d4af37] pb-1'
                      : 'hover:text-[#d4af37]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 flex flex-col gap-3 px-4">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm text-left transition-colors py-2 ${
                  isActive
                    ? 'text-[#d4af37] font-semibold'
                    : 'hover:text-[#d4af37]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* "맨 위로" 플로팅 버튼 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#d4af37] hover:bg-[#c9a227] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
          title="맨 위로"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </header>
  );
}
