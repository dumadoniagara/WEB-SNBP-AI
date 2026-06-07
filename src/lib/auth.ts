/**
 * Session helpers. The JWT is stored in an httpOnly, sameSite cookie so it is
 * never exposed to client-side JavaScript. The token is a standard JWT, so we
 * can cheaply read its claims (email) on the server to greet the user without
 * an extra round-trip.
 */

import { cookies } from "next/headers";

export const SESSION_COOKIE = "snbp_token";
// Backend tokens are valid for 1 hour (see JwtTokenProvider).
const MAX_AGE = 60 * 60;

export async function setSession(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

interface JwtClaims {
  sub?: string;
  email?: string;
  exp?: number;
}

/** Decode a JWT payload without verifying the signature (server-side display only). */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<{ email: string } | null> {
  const token = await getToken();
  if (!token) return null;
  const claims = decodeJwt(token);
  const email = claims?.email ?? claims?.sub;
  if (!email) return null;
  return { email };
}
