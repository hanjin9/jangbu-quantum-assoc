import { SignJWT, jwtVerify } from 'jose';
import { getDb } from '../db';
import { jwtSessions } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function createJWTSession(userId: number, expiresIn: number = 7 * 24 * 60 * 60 * 1000) {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn);

    const token = await new SignJWT({
      userId,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(expiresAt.getTime() / 1000)
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    const refreshToken = await new SignJWT({
      userId,
      type: 'refresh',
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).getTime() / 1000)
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    const db = await getDb();
    if (db) {
      await db.insert(jwtSessions).values({
        userId,
        token,
        refreshToken,
        expiresAt,
        createdAt: now
      });
    }

    return { token, refreshToken, expiresAt };
  } catch (error) {
    console.error('[JWT] Failed to create session:', error);
    throw error;
  }
}

export async function verifyJWTToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: number; iat: number; exp: number };
  } catch (error) {
    console.error('[JWT] Token verification failed:', error);
    return null;
  }
}

export async function refreshJWTToken(refreshToken: string) {
  try {
    const verified = await jwtVerify(refreshToken, secret);
    const payload = verified.payload as { userId: number; type: string };

    if (payload.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    const { token, refreshToken: newRefreshToken, expiresAt } = await createJWTSession(payload.userId);
    return { token, refreshToken: newRefreshToken, expiresAt };
  } catch (error) {
    console.error('[JWT] Refresh token failed:', error);
    return null;
  }
}

export async function revokeJWTSession(userId: number) {
  try {
    const db = await getDb();
    if (db) {
      await db.delete(jwtSessions).where(eq(jwtSessions.userId, userId));
    }
    return true;
  } catch (error) {
    console.error('[JWT] Failed to revoke session:', error);
    return false;
  }
}

export async function getJWTSession(userId: number) {
  try {
    const db = await getDb();
    if (!db) return null;

    const result = await db.select().from(jwtSessions).where(eq(jwtSessions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('[JWT] Failed to get session:', error);
    return null;
  }
}
