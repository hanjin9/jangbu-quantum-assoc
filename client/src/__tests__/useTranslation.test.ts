import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation, getLanguageName } from '../hooks/useTranslation';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTranslation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with Korean as default language', async () => {
    const { result } = renderHook(() => useTranslation());
    
    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(result.current.language).toBe('ko');
  });

  it('should change language', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      result.current.changeLanguage('en');
    });

    expect(result.current.language).toBe('en');
  });

  it('should persist language preference to localStorage', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      result.current.changeLanguage('zh');
    });

    expect(localStorageMock.getItem('jangbu_language')).toBe('zh');
  });

  it('should translate keys correctly', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    const homeText = result.current.t('common.home');
    expect(homeText).toBe('홈');
  });

  it('should return default value for missing keys', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    const missingKey = result.current.t('non.existent.key', 'Default Value');
    expect(missingKey).toBe('Default Value');
  });

  it('should support all available languages', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.availableLanguages).toContain('ko');
    expect(result.current.availableLanguages).toContain('en');
    expect(result.current.availableLanguages).toContain('zh');
    expect(result.current.availableLanguages).toContain('ja');
  });

  it('should translate to English', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      result.current.changeLanguage('en');
    });

    const homeText = result.current.t('common.home');
    expect(homeText).toBe('Home');
  });

  it('should translate to Chinese', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      result.current.changeLanguage('zh');
    });

    const homeText = result.current.t('common.home');
    expect(homeText).toBe('首页');
  });

  it('should translate to Japanese', async () => {
    const { result } = renderHook(() => useTranslation());
    
    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      result.current.changeLanguage('ja');
    });

    const homeText = result.current.t('common.home');
    expect(homeText).toBe('ホーム');
  });
});

describe('getLanguageName', () => {
  it('should return correct language names', () => {
    expect(getLanguageName('ko')).toBe('한국어');
    expect(getLanguageName('en')).toBe('English');
    expect(getLanguageName('zh')).toBe('中文');
    expect(getLanguageName('ja')).toBe('日本語');
  });
});
