# SNBP·AI — Web Client

A modern, mobile-responsive web client for the **SNBP-AI** UTBK drilling
platform. Brings the question bank (previously WhatsApp-only) to the browser:
a marketing landing page, authentication, and an interactive drilling
experience with instant explanations.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and
**Tailwind CSS v4**.

## Architecture

The app uses a **Backend-for-Frontend (BFF)** pattern. The browser never talks
to the Spring backend directly — it calls our own Next.js Route Handlers, which
proxy to the backend. This keeps the JWT in an **httpOnly cookie** (not exposed
to client JS) and sidesteps CORS entirely.

```
Browser ──> Next.js Route Handlers (/api/*) ──> Spring Boot backend (:8080/api)
              │
              └─ JWT stored in httpOnly cookie (snbp_token)
```

| Path | Purpose |
|------|---------|
| `src/lib/api.ts` | Server-side typed client for the Spring backend |
| `src/lib/auth.ts` | Session cookie helpers + JWT claim decoding |
| `src/lib/types.ts` | TypeScript types mirroring the backend DTOs |
| `src/proxy.ts` | Edge proxy (formerly middleware) — route auth gating |
| `src/app/api/*` | BFF route handlers (login, register, logout, questions) |
| `src/app/page.tsx` | Public landing page (pulls live topics, static fallback) |
| `src/app/login`, `src/app/register` | Authentication |
| `src/app/dashboard` | Drill configuration (materi / difficulty / count) |
| `src/app/drill` | Interactive drilling session + results |

### Pages

- **Landing (`/`)** — hero, features, how-it-works, live materi showcase, CTAs.
  Logged-in users are redirected to the dashboard.
- **Login / Register (`/login`, `/register`)** — registration auto-logs-in.
- **Dashboard (`/dashboard`)** — pick sub-test, difficulty, and question count.
- **Drilling (`/drill`)** — answer questions one-by-one with instant
  correct/incorrect feedback and explanations, then a score + review screen.

Routes `/dashboard` and `/drill` require a session; `/login` and `/register`
redirect away if already authenticated. Enforced in `src/proxy.ts`.

## Getting started

Requires the SNBP-AI backend running (default `http://localhost:8080/api`).

```bash
# 1. Configure the backend URL (defaults shown)
echo "BACKEND_API_URL=http://localhost:8080/api" > .env.local

# 2. Install & run
npm install
npm run dev          # http://localhost:3000

# Production
npm run build && npm start
```

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `BACKEND_API_URL` | `http://localhost:8080/api` | Base URL of the Spring backend (server-side only) |

## Backend endpoints consumed

- `POST /auth/login` → `{ accessToken }`
- `POST /users` → register
- `GET /topics` → TPS / Literasi hierarchy with sub-tests
- `GET /questions/random?count=&subTestId=&difficulty=` → drilling questions
# WEB-SNBP-AI
