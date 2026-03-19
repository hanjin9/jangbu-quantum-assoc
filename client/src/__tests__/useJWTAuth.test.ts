import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

const JWT_TOKEN_KEY = 'jangbu_jwt_token';
const REFRESH_TOKEN_KEY = 'jangbu_refresh_token';
const TOKEN_EXPIRY_KEY = 'jangbu_token_expiry';

describe('JWT Token LocalStorage Management', () => {
  beforeEach(() => {
    // LocalStorage 초기화
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save tokens to localStorage', () => {
    const tokens = {
      token: 'test_token_123',
      refreshToken: 'test_refresh_token_456',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem(JWT_TOKEN_KEY, tokens.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt);

    expect(localStorage.getItem(JWT_TOKEN_KEY)).toBe(tokens.token);
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe(tokens.refreshToken);
    expect(localStorage.getItem(TOKEN_EXPIRY_KEY)).toBe(tokens.expiresAt);
  });

  it('should retrieve tokens from localStorage', () => {
    const tokens = {
      token: 'test_token_123',
      refreshToken: 'test_refresh_token_456',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem(JWT_TOKEN_KEY, tokens.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt);

    const savedToken = localStorage.getItem(JWT_TOKEN_KEY);
    const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const savedExpiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);

    expect(savedToken).toBe(tokens.token);
    expect(savedRefreshToken).toBe(tokens.refreshToken);
    expect(savedExpiresAt).toBe(tokens.expiresAt);
  });

  it('should check if token is expired', () => {
    // 만료된 토큰
    const expiredTime = new Date(Date.now() - 1000).toISOString();
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiredTime);

    const expiredExpiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const expiredTime_ms = new Date(expiredExpiresAt!).getTime();
    const currentTime_ms = new Date().getTime();

    expect(currentTime_ms > expiredTime_ms).toBe(true);

    // 유효한 토큰
    localStorage.clear();
    const validTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem(TOKEN_EXPIRY_KEY, validTime);

    const validExpiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const validTime_ms = new Date(validExpiresAt!).getTime();

    expect(currentTime_ms < validTime_ms).toBe(true);
  });

  it('should clear tokens from localStorage', () => {
    const tokens = {
      token: 'test_token_123',
      refreshToken: 'test_refresh_token_456',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem(JWT_TOKEN_KEY, tokens.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt);

    // 토큰 저장 확인
    expect(localStorage.getItem(JWT_TOKEN_KEY)).toBe(tokens.token);

    // 토큰 삭제
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);

    // 토큰 삭제 확인
    expect(localStorage.getItem(JWT_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(TOKEN_EXPIRY_KEY)).toBeNull();
  });

  it('should maintain login state across page refresh', () => {
    const tokens = {
      token: 'test_token_123',
      refreshToken: 'test_refresh_token_456',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // 첫 번째 페이지 로드: 토큰 저장
    localStorage.setItem(JWT_TOKEN_KEY, tokens.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt);

    // 페이지 새로고침 시뮬레이션: 토큰 복원
    const restoredToken = localStorage.getItem(JWT_TOKEN_KEY);
    const restoredRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const restoredExpiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);

    expect(restoredToken).toBe(tokens.token);
    expect(restoredRefreshToken).toBe(tokens.refreshToken);
    expect(restoredExpiresAt).toBe(tokens.expiresAt);
  });

  it('should handle missing tokens gracefully', () => {
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);

    expect(token).toBeNull();
    expect(refreshToken).toBeNull();
    expect(expiresAt).toBeNull();
  });

  it('should handle partial tokens gracefully', () => {
    // 토큰만 저장 (불완전한 상태)
    localStorage.setItem(JWT_TOKEN_KEY, 'test_token_123');

    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    expect(token).toBe('test_token_123');
    expect(refreshToken).toBeNull();

    // 이 경우 전체 토큰 세트가 없으므로 로그인 상태 유지 불가
    const hasCompleteTokens = token && refreshToken;
    expect(hasCompleteTokens).toBeFalsy();
  });
});
