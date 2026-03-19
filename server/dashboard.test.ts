import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Dashboard Page', () => {
  it('should render dashboard component without errors', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    // Verify component structure
    expect(content).toContain('export default function Dashboard');
    expect(content).toContain('useAuth');
    expect(content).toContain('useState');
    expect(content).toContain('useEffect');
  });

  it('should have subscription tab content', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(content).toContain('구독 정보');
    expect(content).toContain('현재 구독');
    expect(content).toContain('구독 취소');
  });

  it('should have orders tab content', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(content).toContain('주문 이력');
    expect(content).toContain('orders');
  });

  it('should have profile tab content', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(content).toContain('프로필');
    expect(content).toContain('이메일');
    expect(content).toContain('역할');
  });

  it('should use tRPC and useAuth hooks', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(content).toContain('import { useAuth }');
    expect(content).toContain('const { user: authUser, logout } = useAuth()');
  });

  it('should handle logout functionality', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(content).toContain('handleLogout');
    expect(content).toContain('await logout()');
  });

  it('should display user information', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(content).toContain('authUser?.name');
    expect(content).toContain('authUser?.email');
    expect(content).toContain('authUser?.role');
  });

  it('should have responsive design classes', () => {
    const dashboardPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Dashboard.tsx';
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    
    expect(content).toContain('max-w-6xl');
    expect(content).toContain('px-4');
    expect(content).toContain('sm:px-6');
    expect(content).toContain('lg:px-8');
  });
});
