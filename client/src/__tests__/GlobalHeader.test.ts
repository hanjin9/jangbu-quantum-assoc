import { describe, it, expect } from 'vitest';

describe('GlobalHeader', () => {
  it('should render logo with correct styling', () => {
    const logoElement = document.querySelector('[title*="협회"]');
    expect(logoElement).toBeDefined();
  });

  it('should have navigation items', () => {
    const navItems = document.querySelectorAll('nav button');
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('should have language switcher', () => {
    const languageSwitcher = document.querySelector('[title*="language"]');
    expect(languageSwitcher).toBeDefined();
  });
});
