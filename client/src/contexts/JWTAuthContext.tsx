import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface JWTTokens {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

interface JWTAuthContextType {
  tokens: JWTTokens | null;
  isInitialized: boolean;
  saveTokens: (tokens: JWTTokens) => void;
  clearTokens: () => void;
  isTokenExpired: () => boolean;
}

const JWTAuthContext = createContext<JWTAuthContextType | undefined>(undefined);

const JWT_TOKEN_KEY = 'jangbu_jwt_token';
const REFRESH_TOKEN_KEY = 'jangbu_refresh_token';
const TOKEN_EXPIRY_KEY = 'jangbu_token_expiry';

export function JWTAuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<JWTTokens | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 토큰을 LocalStorage에 저장
  const saveTokens = (newTokens: JWTTokens) => {
    try {
      localStorage.setItem(JWT_TOKEN_KEY, newTokens.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refreshToken);
      localStorage.setItem(TOKEN_EXPIRY_KEY, newTokens.expiresAt);
      setTokens(newTokens);
      console.log('[JWT] Tokens saved to localStorage');
    } catch (error) {
      console.error('[JWT] Failed to save tokens:', error);
    }
  };

  // LocalStorage에서 토큰 조회
  const getTokensFromStorage = (): JWTTokens | null => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (token && refreshToken && expiresAt) {
        return { token, refreshToken, expiresAt };
      }
      return null;
    } catch (error) {
      console.error('[JWT] Failed to get tokens:', error);
      return null;
    }
  };

  // 토큰 만료 여부 확인
  const isTokenExpired = (): boolean => {
    try {
      const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiresAt) return true;

      const expiryTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();
      const isExpired = currentTime > expiryTime;

      if (isExpired) {
        console.log('[JWT] Token is expired');
      }

      return isExpired;
    } catch (error) {
      console.error('[JWT] Failed to check token expiry:', error);
      return true;
    }
  };

  // 토큰 삭제 (로그아웃)
  const clearTokens = () => {
    try {
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      setTokens(null);
      console.log('[JWT] Tokens cleared from localStorage');
    } catch (error) {
      console.error('[JWT] Failed to clear tokens:', error);
    }
  };

  // 초기화: 페이지 로드 시 저장된 토큰 확인
  useEffect(() => {
    const savedTokens = getTokensFromStorage();

    if (savedTokens) {
      if (!isTokenExpired()) {
        setTokens(savedTokens);
        console.log('[JWT] Valid tokens restored from localStorage');
      } else {
        console.log('[JWT] Saved tokens are expired, clearing');
        clearTokens();
      }
    }

    setIsInitialized(true);
  }, []);

  // 토큰 만료 시간이 다가오면 자동 갱신 (5분 전)
  useEffect(() => {
    if (!tokens) return;

    const checkAndRefresh = () => {
      try {
        const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiresAt) return;

        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeUntilExpiry = expiryTime - currentTime;
        const fiveMinutes = 5 * 60 * 1000;

        if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
          console.log('[JWT] Token expiring soon, should refresh');
          // 실제 구현에서는 여기서 토큰 갱신 로직 호출
        }
      } catch (error) {
        console.error('[JWT] Failed to check token expiry:', error);
      }
    };

    // 1분마다 확인
    const interval = setInterval(checkAndRefresh, 60000);
    return () => clearInterval(interval);
  }, [tokens]);

  return (
    <JWTAuthContext.Provider
      value={{
        tokens,
        isInitialized,
        saveTokens,
        clearTokens,
        isTokenExpired,
      }}
    >
      {children}
    </JWTAuthContext.Provider>
  );
}

export function useJWTAuthContext() {
  const context = useContext(JWTAuthContext);
  if (context === undefined) {
    throw new Error('useJWTAuthContext must be used within JWTAuthProvider');
  }
  return context;
}
