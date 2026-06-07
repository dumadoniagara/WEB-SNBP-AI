/**
 * Server-side client for the SNBP-AI Spring Boot backend.
 *
 * These helpers run on the Next.js server only (Route Handlers / Server
 * Components). The browser never talks to the backend directly — it goes
 * through our own /api routes. This keeps the JWT in an httpOnly cookie and
 * sidesteps CORS entirely.
 */

import type { AuthResponse, Question, Topic, UserResponse, Difficulty } from "./types";

const BASE_URL = process.env.BACKEND_API_URL ?? "http://localhost:8080/api";

export class BackendError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    // Backend data is dynamic; never cache by default.
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // non-JSON error body — keep default message
    }
    throw new BackendError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  // Some endpoints (e.g. empty body) may not return JSON.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/* ----------------------------- Auth ----------------------------- */

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function register(email: string, password: string) {
  return request<UserResponse>("/users", {
    method: "POST",
    body: { email, password },
  });
}

/* ----------------------------- Catalog -------------------------- */

export function getTopics() {
  return request<Topic[]>("/topics");
}

/* ----------------------------- Questions ------------------------ */

export interface RandomQuestionParams {
  count?: number;
  subTestId?: number;
  difficulty?: Difficulty;
}

export function getRandomQuestions(params: RandomQuestionParams = {}) {
  const search = new URLSearchParams();
  search.set("count", String(params.count ?? 10));
  if (params.subTestId) search.set("subTestId", String(params.subTestId));
  if (params.difficulty) search.set("difficulty", params.difficulty);
  return request<Question[]>(`/questions/random?${search.toString()}`);
}
