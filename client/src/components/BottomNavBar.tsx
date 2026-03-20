import { useLocation } from 'wouter';
import { Home, User, BookOpen, Users, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavBar() {
  const [location, navigate] = useLocation();

  const navItems = [
    { icon: BookOpen, label: '교육', path: '/academy', id: 'academy' },
    { icon: Phone, label: '상담', path: '/appointments', id: 'appointments' },
    { icon: Home, label: '홈', path: '/', id: 'home', primary: true },
    { icon: User, label: '마이', path: '/profile', id: 'profile' },
    { icon: Users, label: '커뮤니티', path: '/community', id: 'community' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900 border-t border-amber-500/30 flex items-center justify-around md:hidden z-40 safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            className={cn(
              'flex flex-col items-center justify-center w-full h-20 transition-all duration-200 active:scale-95',
              active
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/50'
            )}
            aria-label={item.label}
          >
            <Icon size={item.primary ? 28 : 24} />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
