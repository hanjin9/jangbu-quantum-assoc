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

  // 초기화: LocalStorage에서 언어 설정 복원
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language | null;
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
      } else {
        // 브라우저 언어 감지
        const browserLanguage = navigator.language.split('-')[0] as Language;
        if (translations[browserLanguage]) {
          setLanguage(browserLanguage);
        }
      }
    } catch (error) {
      console.error('[i18n] Failed to initialize language:', error);
    }
    setIsInitialized(true);
  }, []);

  // 언어 변경
  const changeLanguage = useCallback((newLanguage: Language) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      try {
        localStorage.setItem(LANGUAGE_KEY, newLanguage);
      } catch (error) {
        console.error('[i18n] Failed to save language preference:', error);
      }
    }
  }, []);

  // 번역 함수
  const t = useCallback(
    (key: string, defaultValue?: string): string => {
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return defaultValue || key;
        }
      }

      return typeof value === 'string' ? value : defaultValue || key;
    },
    [language]
  );

  return {
    language,
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
