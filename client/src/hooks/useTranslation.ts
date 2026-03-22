import { useState, useEffect, useCallback } from 'react';
import koTranslations from '../locales/ko.json';
import enTranslations from '../locales/en.json';
import zhTranslations from '../locales/zh.json';
import jaTranslations from '../locales/ja.json';
import esTranslations from '../locales/es.json';

export type Language = 'ko' | 'en' | 'zh' | 'ja' | 'es';

interface Translations {
  [key: string]: {
    [key: string]: string | { [key: string]: string };
  };
}

const translations: Record<Language, Translations> = {
  ko: koTranslations,
  en: enTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
  es: esTranslations,
};

const LANGUAGE_KEY = 'jangbu_language';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('ko');
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기화: 한국어만 활성화
  useEffect(() => {
    try {
      // 항상 한국어로 설정
      setLanguage('ko');
      localStorage.setItem(LANGUAGE_KEY, 'ko');
    } catch (error) {
      console.error('[i18n] Failed to initialize language:', error);
    }
    setIsInitialized(true);
  }, []);

  // 언어 변경: 한국어만 적용, 다른 언어는 버튼만 유지
  const changeLanguage = useCallback((newLanguage: Language) => {
    // 한국어만 실제로 변경, 다른 언어는 무시
    if (newLanguage === 'ko') {
      setLanguage('ko');
      try {
        localStorage.setItem(LANGUAGE_KEY, 'ko');
      } catch (error) {
        console.error('[i18n] Failed to save language preference:', error);
      }
    }
    // 다른 언어 선택 시 한국어 유지
  }, []);

  // 번역 함수
  const t = useCallback(
    (key: string, defaultValue?: string): string => {
      const keys = key.split('.');
      let value: any = translations['ko'];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return defaultValue || key;
        }
      }

      return typeof value === 'string' ? value : defaultValue || key;
    },
    []
  );

  return {
    language: 'ko',
    changeLanguage,
    t,
    isInitialized,
    availableLanguages: ['ko', 'en', 'zh', 'ja', 'es'] as Language[],
  };
}

export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    ko: '한국어',
    en: 'English',
    zh: '中文',
    ja: '日本語',
    es: 'Español',
  };
  return names[lang];
}
