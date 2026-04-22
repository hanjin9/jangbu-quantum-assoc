'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, Settings, ChevronDown, Info, BookOpen, Users, User, Newspaper, ArrowLeft, ArrowUp, Globe, Search, LogOut, Home } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

export function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);
  const [hoverLanguage, setHoverLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('한국어');
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  const languages = [
    { name: '한국어', flag: '🇰🇷' },
    { name: 'English', flag: '🇺🇸' },
    { name: 'Español', flag: '🇪🇸' },
    { name: '中文', flag: '🇨🇳' },
    { name: 'हिन्दी', flag: '🇮🇳' },
    { name: 'Français', flag: '🇫🇷' },
    { name: 'Русский', flag: '🇷🇺' },
    { name: 'العربية', flag: '🇸🇦' },
    { name: 'Deutsch', flag: '🇩🇪' },
    { name: 'Italiano', flag: '🇮🇹' },
    { name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { name: 'ไทย', flag: '🇹🇭' },
    { name: 'Tiếng Việt', flag: '🇻🇳' },
  ];
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
  const t = (key: string) => key;

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

  // 검색창 자동 닫힘 (입력 없으면 2-3초 후)
  useEffect(() => {
    if (searchOpen && !searchQuery) {
      if (searchTimer) clearTimeout(searchTimer);
      const timer = setTimeout(() => {
        setSearchOpen(false);
      }, 2500);
      setSearchTimer(timer);
    } else {
      if (searchTimer) clearTimeout(searchTimer);
    }
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [searchOpen, searchQuery]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTimer) clearTimeout(searchTimer);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const baseNavItems = [
    {
      label: '소개',
      path: '/about',
      submenu: [
        { label: '협회 소개', path: '/about' },
        { label: '비전 & 미션', path: '/about#vision' },
      ],
    },
    {
      label: '학습',
      path: '/academy',
      submenu: [
        { label: '교육 과정', path: '/academy' },
        { label: '시험', path: '/academy#exam' },
      ],
    },
    {
      label: '커뮤니티',
      path: '/community',
      submenu: [
        { label: '게시판', path: '/community' },
        { label: '이벤트', path: '/community#events' },
      ],
    },
    {
      label: '멤버십',
      path: '/membership',
      submenu: [
        { label: '회원 가입', path: '/signup' },
        { label: '멤버십 선택', path: '/membership' },
      ],
    },
    {
      label: '소식',
      path: '/news',
      submenu: [
        { label: '뉴스', path: '/news' },
        { label: '공지사항', path: '/news#notices' },
      ],
    },
    {
      label: '쇼핑몰',
      path: '/shopping',
      submenu: [
        { label: '건강 제품', path: '/shopping/products' },
        { label: '건강 기기', path: '/shopping/devices' },
      ],
    },
  ];

  // 권한 기반 메뉴 필터링
  const navItems = baseNavItems.filter(item => {
    // 모든 사용자에게 기본 메뉴 표시 (로그인 상태 관계없음)
    if (['소개', '학습', '커뮤니티', '멤버십', '소식'].includes(item.label)) {
      return true;
    }
    // 쇼핑몰은 Admin 이상만 표시
    if (item.label === '쇼핑몰') {
      return user && (user.role === 'admin' || user.role === 'owner');
    }
    return false;
  });

  const getMenuIcon = (label: string, isMobile = false) => {
    const size = isMobile ? 'w-7 h-7' : 'w-5 h-5';
    switch (label) {
      case '소개':
        return <Info className={size} />;
      case '학습':
        return <BookOpen className={size} />;
      case '커뮤니티':
        return <Users className={size} />;
      case '회원':
        return <User className={size} />;
      case '소식':
        return <Newspaper className={size} />;
      case '쇼핑몰':
        return <Newspaper className={size} />;
      default:
        return null;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Back Button */}
            <div className="flex items-center gap-3">
              {/* 뒤로가기 버튼 (모바일) */}
              {canGoBack && (
                <button
                  onClick={() => window.history.back()}
                  className="md:hidden p-1 hover:bg-accent rounded-lg transition flex-shrink-0"
                  title="뒤로가기"
                >
                  <ArrowLeft className="h-6 w-6 text-[#d4af37]" />
                </button>
              )}

              {/* 로고 - 모바일에서는 박스만, PC에서는 텍스트 없음 */}
              <button
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0"
              >
                {/* 로고 130% 확대 */}
                <div className="w-10 h-10 md:w-13 md:h-13 bg-gradient-to-br from-[#1a4d7a] to-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs md:text-sm">장•부</span>
                </div>
              </button>

              {/* 언어 선택 - 모바일 (지구본만 표시) - 호버 모드 */}
              <div className="md:hidden relative" onMouseEnter={() => setHoverLanguage(true)} onMouseLeave={() => setHoverLanguage(false)}>
                <button
                  className="p-1 hover:bg-accent rounded-lg transition flex-shrink-0"
                  title="언어 선택"
                >
                  <Globe className="h-6 w-6 text-[#d4af37]" />
                </button>
                {hoverLanguage && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in duration-200 max-h-96 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.name}
                        onMouseEnter={() => setHoveredLanguage(lang.name)}
                        onMouseLeave={() => setHoveredLanguage(null)}
                        onClick={() => setSelectedLanguage(lang.name)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                          selectedLanguage === lang.name
                            ? 'text-slate-900 bg-[#d4af37]/20 font-semibold'
                            : hoveredLanguage === lang.name
                            ? 'text-slate-900 bg-[#d4af37]/10'
                            : 'text-slate-700 hover:bg-[#d4af37]/5'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {selectedLanguage === lang.name && <span className="ml-auto text-[#d4af37] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center Section - Desktop Navigation */}
            <nav className="hidden md:flex gap-2 items-center flex-1 justify-center">
              {navItems.map((item) => {
                const isActive = location === item.path;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                return (
                  <div key={item.label} className="relative group">
                    <button
                      onClick={() => !hasSubmenu && handleNavClick(item.path)}
                      className={`text-sm transition-colors whitespace-nowrap px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'text-[#d4af37] font-semibold bg-[#d4af37]/10'
                          : 'text-slate-700 hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                      }`}
                    >
                      {item.label}
                      {hasSubmenu && <ChevronDown className="w-3 h-3" />}
                    </button>
                    {/* Desktop Submenu - 호버 시 자동 펼쳐지는 애니메이션 */}
                    {hasSubmenu && item.submenu && (
                      <div className="absolute left-0 mt-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50 transform scale-95 group-hover:scale-100">
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

            {/* Right Section - Search, Settings, Profile */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* 검색 기능 */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-1 text-sm border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1 hover:bg-accent rounded-lg transition flex-shrink-0"
                    >
                      <Search className="h-5 w-5 text-[#d4af37]" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 md:gap-0">
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="p-1 hover:bg-accent rounded-lg transition flex-shrink-0 md:hidden"
                      title="검색"
                    >
                      <Search className="h-6 w-6 text-[#d4af37]" />
                    </button>
                    <span className="hidden md:inline text-sm text-slate-600 font-semibold">장•부 양자요법 관리사협회</span>
                  </div>
                )}
              </div>

              {/* 설정 아이콘 200% 확대 */}
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1.5 hover:bg-accent rounded-lg transition flex-shrink-0"
                title="설정"
              >
                <Settings className="h-8 w-8 text-[#d4af37]" />
              </button>

              {/* 사용자 프로필 드롭다운 - 호버 모드 */}
              {user ? (
                <div 
                  className="relative" 
                  onMouseEnter={() => setHoverProfile(true)} 
                  onMouseLeave={() => setHoverProfile(false)}
                >
                  <button
                    className="flex items-center gap-2 p-1 hover:bg-accent rounded-lg transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#1a4d7a] flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{user.name?.charAt(0) || '👤'}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#d4af37] hidden md:inline">{user.name || '사용자'}</span>
                  </button>
                  {hoverProfile && (
                    <div className="absolute right-0 mt-0 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in duration-200">
                      <button
                        onClick={() => navigate('/my-page')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-800 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        마이페이지
                      </button>
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-800 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        설정
                      </button>
                      {/* 권한 기반 메뉴 */}
                      {user?.role === 'owner' && (
                        <>
                          <hr className="my-1" />
                          <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2 font-semibold"
                          >
                            <Settings className="w-4 h-4" />
                            관리자 (Owner)
                          </button>
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <>
                          <hr className="my-1" />
                          <button
                            onClick={() => navigate('/admin/members')}
                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-2 font-semibold"
                          >
                            <Users className="w-4 h-4" />
                            학생 관리 (Admin)
                          </button>
                        </>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {/* 모바일 메뉴 버튼 - X 크기/굵기 50% 축소 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 hover:bg-accent rounded-lg transition flex-shrink-0"
                title="메뉴"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 stroke-[1.5]" />
                ) : (
                  <Menu className="h-12 w-12 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - 애니메이션 추가 */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              return (
                <div key={item.label}>
                  <button
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
                    onClick={() => {
                      if (!hasSubmenu) {
                        handleNavClick(item.path);
                      } else {
                        setOpenSubmenu(openSubmenu === item.label ? null : item.label);
                      }
                    }}
                    className={`w-full text-left text-lg font-bold transition-all py-3 px-4 rounded-lg flex items-center justify-between gap-2 active:scale-95 ${
                      openSubmenu === item.label
                        ? 'text-[#d4af37] font-bold bg-[#d4af37]/10'
                        : isActive
                        ? 'text-[#d4af37] font-bold bg-[#d4af37]/10'
                        : 'text-slate-800 hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {getMenuIcon(item.label, true)}
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
                  {/* Mobile Submenu - 아래로 펼쳐지는 애니메이션 */}
                  {hasSubmenu && openSubmenu === item.label && item.submenu && (
                    <div className="pl-4 space-y-1 mt-2 animate-in slide-in-from-top-2 duration-300 border-l-2 border-[#d4af37]/30">
                      {item.submenu.map((subitem) => (
                        <button
                          key={subitem.label}
                          onClick={() => handleNavClick(subitem.path)}
                          className="w-full text-left text-base font-semibold text-slate-800 hover:text-[#d4af37] py-2 px-4 rounded-lg hover:bg-[#d4af37]/10 transition-all duration-200 transform hover:translate-x-1"
                        >
                          {subitem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => handleNavClick('/')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              location === '/' ? 'text-[#d4af37]' : 'text-slate-600 hover:text-[#d4af37]'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">홈</span>
          </button>
          <button
            onClick={() => handleNavClick('/academy')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              location === '/academy' ? 'text-[#d4af37]' : 'text-slate-600 hover:text-[#d4af37]'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-semibold">학습</span>
          </button>
          <button
            onClick={() => handleNavClick('/community')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              location === '/community' ? 'text-[#d4af37]' : 'text-slate-600 hover:text-[#d4af37]'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-semibold">커뮤니티</span>
          </button>
          <button
            onClick={() => handleNavClick('/membership')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              location === '/membership' ? 'text-[#d4af37]' : 'text-slate-600 hover:text-[#d4af37]'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-semibold">회원</span>
          </button>
        </div>
      </nav>

      {/* PC Navigation - Back & Top Buttons */}
      {canGoBack && (
        <button
          onClick={() => window.history.back()}
          className="hidden md:flex fixed bottom-8 left-8 w-12 h-12 rounded-full bg-white/50 hover:bg-white/80 text-slate-600 hover:text-[#d4af37] transition-all items-center justify-center shadow-lg"
          title="뒤로가기"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hidden md:flex fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#d4af37] hover:bg-[#d4af37]/90 text-white transition-all items-center justify-center shadow-lg"
          title="위로 이동"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Add padding to body to account for fixed bottom nav on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
