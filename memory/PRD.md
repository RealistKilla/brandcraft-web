# Brandcraft — Project Memory

## Original task
User asked to scan the existing project and write a README summarizing what the project does and its architecture (full docs: overview, architecture, setup, API, tech stack; audience: both general/non-technical and developers; saved to /app/README.md).

## What this codebase is
Existing Next.js 15 (App Router) full-stack app called "Brandcraft" — an AI-powered marketing platform:
- Public marketing site + waitlist capture
- JWT-based auth (bcryptjs + jsonwebtoken, httpOnly cookie), multi-tenant via Organization/User (roles ADMIN/MEMBER)
- Applications (API-key style integrations) feed PlatformUser analytics data
- AI generation (Vercel AI SDK `ai` + `@ai-sdk/google`, model gemini-1.5-pro, `generateObject` + Zod schemas) for:
  - Persona generation (from PlatformUser analytics)
  - Campaign generation (from Persona)
  - Content generation (from Campaign + Persona, per social platform)
- Prisma ORM → PostgreSQL (models: Organization, User, Application, PlatformUser, Persona, Campaign, Content, Industries, AgeRanges, Waitlist)
- Dashboard UI (shadcn/ui + Tailwind + Recharts) at /dashboard for applications, personas, campaigns, content, analytics, settings
- middleware.ts currently redirects /auth/* and /dashboard/* to /waitlist (app in gated launch state)

## Work done (this session)
- Scanned full repo structure, package.json, prisma/schema.prisma, all API routes under app/api, lib/*, middleware, key pages/components.
- No .env file present in repo; env vars referenced in code: JWT_SECRET, DATABASE_URL, DIRECT_URL (Prisma), and Google Generative AI key required by @ai-sdk/google.
- Wrote comprehensive README.md (overview, architecture diagram, request flow, tech stack, data model, access control, setup/run instructions, project structure, plain-language summary) — saved to /app/README.md (overwrote placeholder).
- No code/functionality was changed; documentation-only task. Testing agent not invoked (no code changes to verify).

## Next action items / backlog
- No .env file currently exists in the repo — user will need to create one with DATABASE_URL, DIRECT_URL, JWT_SECRET, and a Google Generative AI key to actually run the app.
- Could add API reference tables (request/response shapes) per endpoint if deeper developer docs are wanted.
- Could add CONTRIBUTING.md / architecture diagrams as images if desired later.
