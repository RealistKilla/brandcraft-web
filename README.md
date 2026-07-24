# Brandcraft

**Brandcraft** is an AI-powered marketing campaign platform. It helps marketing teams and agencies turn raw customer/analytics data into actionable customer personas, translate those personas into full marketing campaign strategies, and generate ready-to-publish, platform-specific content — all backed by generative AI (Google Gemini).

In short, the product automates the classic marketing funnel:

```
Platform user data  →  AI Persona  →  AI Campaign Strategy  →  AI Content (per social platform)
```

## What it does

1. **Onboarding & Waitlist** — Public marketing site (Home, Features, Pricing, Solutions, About, Contact) with an email waitlist capture flow for pre-launch signups.
2. **Authentication** — Email/password sign up and sign in with JWT-based sessions (httpOnly cookies). Users belong to an **Organization** and are either an `ADMIN` or `MEMBER`.
3. **Applications** — Each organization can register one or more "Applications" (API-key style integrations), which are the source of the analytics/platform user data used for persona generation.
4. **Analytics Dashboard** — Visual overview of platform users: total users, active users, revenue, signups over time, and demographic breakdowns (industry, age, location, job title).
5. **AI Persona Generation** — Given an application's aggregated user analytics, the AI (Gemini) synthesizes a structured customer persona (demographics, behaviors, preferences, pain points, motivations).
6. **AI Campaign Generation** — Given a persona, the AI drafts a full campaign: name, description, strategy, channels, timeline, and suggested budget.
7. **AI Content Generation** — Given a campaign + persona + target platforms (Instagram, X/Twitter, LinkedIn, Facebook, TikTok, YouTube), the AI produces platform-tailored copy, hashtags, CTAs, image descriptions, and posting recommendations.
8. **Dashboard Management** — Authenticated area (`/dashboard`) to manage Applications, Personas, Campaigns, Content, Analytics, and account Settings.

## Architecture

Brandcraft is a single **Next.js 15 (App Router)** full-stack application — the frontend (React Server/Client Components) and backend (API routes) live in the same codebase and deployment unit.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Application                      │
│                                                                   │
│  app/                         Pages & Layouts (App Router)       │
│   ├─ page.tsx                 Marketing homepage                 │
│   ├─ features / pricing /     Static marketing pages             │
│   │  solutions / about /                                         │
│   │  contact / waitlist                                          │
│   ├─ auth/signin, signup       Auth pages                        │
│   ├─ dashboard/                Authenticated app shell           │
│   │  ├─ page.tsx               Overview / stats                  │
│   │  ├─ applications/          Manage API applications           │
│   │  ├─ personas/              View/generate personas            │
│   │  ├─ campaigns/             View/generate campaigns            │
│   │  ├─ content/               View/generate content             │
│   │  ├─ analytics/             Charts & breakdowns               │
│   │  └─ settings/              Profile/appearance/notifications  │
│   └─ api/                      Backend REST endpoints            │
│      ├─ auth/{signup,signin,signout,me}                          │
│      ├─ waitlist                                                 │
│      ├─ applications                                             │
│      ├─ analytics, dashboard/overview                            │
│      ├─ personas, generate-persona                               │
│      ├─ campaigns, generate-campaign                             │
│      ├─ content, generate-content                                │
│      └─ industries, age_ranges                                   │
│                                                                   │
│  components/                  React UI                           │
│   ├─ ui/                      shadcn/ui primitives (Radix based) │
│   ├─ sections/                Marketing sections (hero, CTA...)  │
│   ├─ layout/                  Header, footer, dashboard sidebar  │
│   ├─ dashboard/                Charts & widgets (Recharts)       │
│   ├─ forms/                    Auth, waitlist, settings forms    │
│   └─ providers/                AuthProvider (React Context)      │
│                                                                   │
│  lib/                                                            │
│   ├─ auth.ts                  bcrypt hashing, JWT sign/verify     │
│   ├─ auth-server.ts            Server-side session lookup         │
│   ├─ prisma.ts                 Prisma client singleton            │
│   ├─ api.ts                    Typed fetch client for /api/*      │
│   └─ utils.ts / constants.ts   Shared helpers                     │
│                                                                   │
│  prisma/schema.prisma          Data model (see below)             │
│  middleware.ts                 Route gating (redirects guests)    │
└─────────────────────────────────────────────────────────────────┘
                 │                                  │
                 ▼                                  ▼
      ┌────────────────────┐            ┌───────────────────────┐
      │ PostgreSQL (Prisma) │            │ Google Gemini (via    │
      │  persistent storage │            │ Vercel AI SDK)        │
      └────────────────────┘            │  generateObject() for │
                                          │  persona/campaign/    │
                                          │  content generation   │
                                          └───────────────────────┘
```

### Request flow (typical AI generation)

1. Client calls `lib/api.ts` → `POST /api/generate-persona` (or `generate-campaign`, `generate-content`).
2. The API route reads the `auth-token` httpOnly cookie, verifies the JWT (`lib/auth.ts`), and scopes every database query by the user's `orgId` (multi-tenant isolation).
3. Relevant data is pulled from PostgreSQL via **Prisma** (e.g. `PlatformUser` rows for personas, a `Persona` for campaigns, a `Campaign` for content).
4. The **Vercel AI SDK** (`ai` package) calls **Google Gemini** (`@ai-sdk/google`, model `gemini-1.5-pro`) via `generateObject()` with a **Zod schema**, guaranteeing a structured, typed JSON response.
5. The generated object is persisted back to PostgreSQL and returned to the client.

### Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, API routes) |
| Language | TypeScript |
| UI | React 18, Tailwind CSS, shadcn/ui (Radix UI primitives), Framer Motion |
| Charts | Recharts |
| Forms & validation | react-hook-form + Zod |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` password hashing, httpOnly cookies |
| ORM / Database | Prisma ORM → PostgreSQL |
| AI | Vercel AI SDK (`ai`) + `@ai-sdk/google` (Gemini `gemini-1.5-pro`) for structured persona/campaign/content generation |
| State | React Context (`AuthProvider`), Jotai, SWR |

### Data model (Prisma / PostgreSQL)

- **Organization** — top-level tenant; owns everything else.
- **User** — belongs to an Organization, `ADMIN` or `MEMBER` role, email+password auth.
- **Application** — an API application/integration owned by an Organization (has `applicationId`/`applicationKey`), the source of platform analytics.
- **PlatformUser** — an end-customer record ingested from an Application (job title, industry, location, age, spend, signup date) — the raw data personas are generated from.
- **Persona** — AI-generated customer persona (demographics, behaviors, preferences as JSON) tied to an Organization/creator.
- **Campaign** — AI-generated campaign strategy tied to a Persona.
- **Content** — AI-generated, platform-specific post content tied to a Campaign.
- **Industries / AgeRanges** — lookup tables used for filters/forms.
- **Waitlist** — pre-launch email signups.

### Access control

- `middleware.ts` redirects unauthenticated visits to `/auth/*` and `/dashboard/*` to the `/waitlist` page (the app is currently in a gated/waitlist launch state).
- All `/api` routes that touch tenant data verify the JWT and filter every Prisma query by the caller's `orgId`, so organizations cannot see each other's data.

## Getting started

### Prerequisites

- Node.js 18+ and Yarn
- A PostgreSQL database (e.g. local Postgres, Supabase, Neon, RDS)
- A Google Generative AI API key (for Gemini persona/campaign/content generation)

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
# PostgreSQL connection (Prisma)
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# JWT signing secret for auth cookies
JWT_SECRET="replace-with-a-strong-random-secret"

# Google Generative AI (Gemini) key, used by @ai-sdk/google
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

### 3. Set up the database

```bash
yarn prisma:generate   # generate the Prisma client
yarn prisma:migrate    # run migrations (creates tables from prisma/schema.prisma)
```

### 4. Run the app

```bash
yarn dev
```

The app will be available at `http://localhost:3000`.

### Other useful scripts

```bash
yarn build            # prisma generate + production build
yarn start            # start production server
yarn lint              # lint the codebase
yarn prisma:studio     # open Prisma Studio to browse the database
```

## Project structure at a glance

```
app/            Next.js routes (pages + /api backend)
components/     Reusable React UI (ui/, sections/, dashboard/, forms/, layout/)
lib/            Auth, Prisma client, API client, shared utils
hooks/          Custom React hooks (e.g. use-toast)
prisma/         Database schema & migrations
public/         Static assets (logos, etc.)
middleware.ts   Route-level auth gating
```

## Notable characteristics for non-technical readers

- Brandcraft is a **web app you sign up for**: create an account, register an "Application" (representing your product/customer base), and Brandcraft's AI turns your customer data into ready-to-use marketing personas, campaign plans, and social content.
- Everything is organized around your **Organization** (a company/workspace), so teammates share the same personas, campaigns, and content.
- The heavy lifting (writing persona profiles, campaign strategies, and social copy) is done by **AI**, not manually — you review and use what's generated.
