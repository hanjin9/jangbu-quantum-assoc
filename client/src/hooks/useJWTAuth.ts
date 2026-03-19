import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';

const JWT_TOKEN_KEY = 'jangbu_jwt_token';
const REFRESH_TOKEN_KEY = 'jangbu_refresh_token';
const TOKEN_EXPIRY_KEY = 'jangbu_token_expiry';

export interface JWTTokens {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export function useJWTAuth() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // 토큰을 LocalStorage에 저장
  const saveTokens = useCallback((tokens: JWTTokens) => {
    try {
      localStorage.setItem(JWT_TOKEN_KEY, tokens.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      localStorage.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt);
    } catch (error) {
      console.error('[JWT] Failed to save tokens:', error);
    }
  }, []);

  // LocalStorage에서 토큰 조회
  const getTokens = useCallback((): JWTTokens | null => {
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
  }, []);

  // 토큰 만료 여부 확인
  const isTokenExpired = useCallback((): boolean => {
    try {
      const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiresAt) return true;

      const expiryTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();

      return currentTime > expiryTime;
    } catch (error) {
      console.error('[JWT] Failed to check token expiry:', error);
      return true;
    }
  }, []);

  // 토큰 삭제 (로그아웃)
  const clearTokens = useCallback(() => {
    try {
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('[JWT] Failed to clear tokens:', error);
    }
  }, []);

  // 토큰 갱신
  const refreshTokens = useCallback(async () => {
    try {
      const tokens = getTokens();
      if (!tokens) return false;

      // 실제 구현에서는 서버에 갱신 요청
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        clearTokens();
        return false;
      }

      const newTokens = await response.json();
      saveTokens(newTokens);
      return true;
    } catch (error) {
      console.error('[JWT] Failed to refresh tokens:', error);
      clearTokens();
      return false;
    }
  }, [getTokens, saveTokens, clearTokens]);

  // 초기화: 페이지 로드 시 저장된 토큰 확인
  useEffect(() => {
    if (loading) return;

    const tokens = getTokens();
    if (tokens && !isTokenExpired()) {
      // 토큰이 유효하면 자동 로그인 상태 유지
      console.log('[JWT] Valid token found, maintaining login state');
    } else if (tokens && isTokenExpired()) {
      // 토큰이 만료되었으면 갱신 시도
      console.log('[JWT] Token expired, attempting refresh');
      refreshTokens();
    }

    setIsInitialized(true);
  }, [loading, getTokens, isTokenExpired, refreshTokens]);

  return {
    isInitialized,
    isAuthenticated: !!user,
    saveTokens,
    getTokens,
    clearTokens,
    isTokenExpired,
    refreshTokens,
  };
}
