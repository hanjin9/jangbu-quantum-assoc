'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, Settings, ChevronDown, Info, BookOpen, Users, User, Newspaper, ArrowLeft, ArrowUp, Globe } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const t = (key: string) => key; // 간단한 번역 함수

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

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

  const handleGoBack = () => {
    window.history.back();
  };

  const navItems = [
    {
      label: '소개',
      path: '/about',
      submenu: [
        { label: '협회소개', path: '/about' },
        { label: '비전', path: '/about' },
        { label: '팀 소개', path: '/team-profile' },
      ],
    },
    {
      label: '학습',
      path: null,
      submenu: [
        { label: '교육과정', path: '/academy' },
        { label: '시험', path: '/exam' },
        { label: '자료실', path: '/exam-practice-book' },
        { label: '성공사례', path: '/success-gallery' },
      ],
    },
    {
      label: '커뮤니티',
      path: null,
      submenu: [
        { label: t('community.title'), path: '/community' },
        { label: '전문가', path: '/team-profile' },
        { label: '블로그', path: '/newsletter-blog' },
      ],
    },
    {
      label: '회원',
      path: null,
      submenu: [
        { label: '회원 등급', path: '/membership-tiers' },
        { label: '프로필', path: '/dashboard' },
        { label: '피드백', path: '/feedback' },
      ],
    },
    {
      label: '소식',
      path: null,
      submenu: [
        { label: '공지사항', path: '/announcements' },
        { label: '알림', path: '/notifications' },
      ],
    },
    {
      label: '관리자',
      path: null,
      submenu: [
        { label: '통계 대시보드', path: '/admin-stats' },
        { label: '수익 분석', path: '/revenue-analytics' },
        { label: '회원 관리', path: '/admin-members' },
      ],
    },
  ];

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 0);
  };

  const getMenuIcon = (label: string) => {
    const iconClass = 'w-5 h-5 text-[#d4af37]';
    switch (label) {
      case '소개':
        return <Info className={iconClass} />;
      case '학습':
        return <BookOpen className={iconClass} />;
      case '커뮤니티':
        return <Users className={iconClass} />;
      case '회원':
        return <User className={iconClass} />;
      case '소식':
        return <Newspaper className={iconClass} />;
      case '관리자':
        return <Settings className={iconClass} />;
      default:
        return null;
    }
  };

  const handleNavClick = (path?: string | null) => {
    if (path) {
      navigate(path);
      setMobileMenuOpen(false);
      setOpenSubmenu(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border safe-top">
      <div className="w-full px-0 py-2 md:py-4">
        <div className="flex justify-between items-center px-1 md:px-6 gap-0.5 md:gap-8 h-14 md:h-auto">
          {/* Logo + Language Switcher - 좌측 */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-0.5 md:gap-2 hover:opacity-80 transition-opacity flex-shrink-0 active:scale-95 pl-1"
              title={t('about.title')}
            >
              {/* 로고 130% 확대 */}
              <div className="w-10 h-10 md:w-13 md:h-13 bg-gradient-to-br from-[#1a4d7a] to-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs md:text-sm">장•부</span>
              </div>
              <h1 className="text-xs md:text-lg font-bold text-[#1a4d7a] hidden md:inline whitespace-nowrap">
                {t('about.title')}
              </h1>
            </button>
            {/* 로고 옆 글로벌 선택 - 모바일 (지구본 200% 확대) */}
            <div className="md:hidden">
              <button
                className="p-1 hover:bg-accent rounded-lg transition flex-shrink-0"
                title="언어 선택"
              >
                <Globe className="h-8 w-8 text-[#d4af37]" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2 items-center flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              return (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`text-sm transition-colors whitespace-nowrap px-3 py-2 rounded-lg flex items-center gap-1 ${
                      isActive
                        ? 'text-[#d4af37] font-semibold bg-[#d4af37]/10'
                        : 'hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                    } ${hasSubmenu ? 'cursor-default' : ''}`}
                  >
                    {item.label}
                    {hasSubmenu && <ChevronDown className="w-3 h-3" />}
                  </button>
                  {/* Desktop Submenu */}
                  {hasSubmenu && item.submenu && (
                    <div className="absolute left-0 mt-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                      {item.submenu.map((subitem) => (
                        <button
                          key={subitem.label}
                          onClick={() => handleNavClick(subitem.path)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                        >
                          {subitem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <LanguageSwitcher />
          </nav>

          {/* 중간 텍스트 - 모바일 (한 줄, 큰 크기) */}
          <div className="md:hidden flex-1 text-center px-1">
            <h2 className="text-lg font-bold text-[#d4af37] leading-tight whitespace-nowrap">
              장•부 (양자요법) 관리사협회
            </h2>
          </div>

          {/* 뒤로가기 + 메뉴 텍스트 + 햄버거 + 설정(톱니바퀴만) - 최대한 우측 */}
          <div className="md:hidden flex items-center gap-0.5 flex-shrink-0 pr-2">
            {/* 뒤로가기 버튼 */}
            {canGoBack && (
              <button
                onClick={handleGoBack}
                className="p-1.5 hover:bg-accent rounded-lg transition opacity-50 hover:opacity-100"
                title="이전 페이지"
              >
                <ArrowLeft className="h-5 w-5 stroke-[2.5] text-slate-600" />
              </button>
            )}

            {/* 메뉴 텍스트 250% 확대 */}
            <span className="text-base font-semibold text-[#d4af37]">메뉴</span>

            {/* 햄버거 메뉴 250% 확대 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:bg-accent rounded-lg transition"
              title="메뉴"
            >
              {mobileMenuOpen ? (
                <X className="h-12 w-12 stroke-[2.5]" />
              ) : (
                <Menu className="h-12 w-12 stroke-[2.5]" />
              )}
            </button>

            {/* 설정 아이콘 200% 확대 */}
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 hover:bg-accent rounded-lg transition flex-shrink-0"
              title="설정"
            >
              <Settings className="h-8 w-8 text-[#d4af37]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - 애니메이션 추가 */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 flex flex-col gap-1 px-4 animate-in slide-in-from-top-2 duration-300">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    if (!hasSubmenu) {
                      handleNavClick(item.path);
                    }
                  }}
                  onMouseEnter={() => {
                    if (hasSubmenu) {
                      setOpenSubmenu(item.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasSubmenu) {
                      setOpenSubmenu(null);
                    }
                  }}
                  className={`w-full text-left text-sm transition-colors py-2 px-3 rounded-lg flex items-center justify-between gap-2 ${
                    isActive
                      ? 'text-[#d4af37] font-semibold bg-[#d4af37]/10'
                      : 'text-slate-800 hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {getMenuIcon(item.label)}
                    {item.label}
                  </span>
                  {hasSubmenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openSubmenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>
                {/* Mobile Submenu */}
                {hasSubmenu && openSubmenu === item.label && item.submenu && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.label}
                        onClick={() => handleNavClick(subitem.path)}
                        className="w-full text-left text-base text-slate-800 hover:text-[#d4af37] py-2 px-3 rounded-lg hover:bg-[#d4af37]/10 transition-colors"
                      >
                        {subitem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}

      {/* Scroll to Top Button - 모바일 우측 하단 메뉴바 위 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-[#d4af37] hover:bg-[#c9a227] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
          title="맨 위로"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </header>
  );
}
