# Willbe

AI-assisted B2B outbound: find target accounts and decision makers, generate personalised outreach sequences (email and LinkedIn), send them and track replies, meetings and campaign performance.

This repository is a portfolio edition of the product. Every paid third-party integration (LinkedIn Sales Navigator data, email delivery, LLM generation, contact enrichment, translation) is replaced by a local mock, so the whole app runs offline at zero cost.

## Stack

| Part | Tech |
| --- | --- |
| `apps/web` | Next.js 15 (app router), React Query, next-intl (en/es/fr), Tailwind, shadcn/ui, Recharts |
| `apps/api` | NestJS 10 in an Nx workspace, Sequelize + PostgreSQL, BullMQ + Redis, JWT auth |
| Infra | Docker Compose for Postgres and Redis, GitHub Actions typecheck |

## Features

- **Account scenarios**: search companies by industry, location, headcount and keywords, save lists.
- **Lead scenarios**: search people at those companies by role, seniority and function.
- **Message campaigns**: build multi-step cadences (LinkedIn connection, LinkedIn message, email), detect lead language, enrich emails and phones, generate messages from structures and templates, send.
- **Tracking**: replies, meetings, out-of-office and bounces per campaign, home dashboard and analytics page.
- **Workspace**: company profile, products, message structures, teammates and invitations, HubSpot connection.

## Mock mode

| Integration | Setting | Mock behaviour |
| --- | --- | --- |
| LinkedIn / Sales Navigator search | `LINKEDIN_PROVIDER=mock` | Deterministic dataset of ~400 companies and ~6,000 people |
| Email delivery | `EMAIL_DELIVERY=mock` | Emails are logged instead of sent; a background job simulates replies, meetings, OOO and bounces after `DEMO_REPLY_DELAY_MINUTES` |
| Message generation | `LLM_PROVIDER=none` | Messages are built from templates. Optionally plug in any OpenAI-compatible endpoint (Ollama, Groq, OpenRouter) or Claude, see `apps/api/.env.example` |
| Contact enrichment | empty `BETTER_CONTACT_API_KEY` | Generates plausible work emails and phones |
| Translation | empty `GOOGLE_TRANSLATE_API_KEY` | Templates are used as-is |

## Run locally

Requirements: Node 22, Docker.

```bash
# 1. Database and Redis
docker compose up -d

# 2. API (http://localhost:3000)
cd apps/api
cp .env.example .env
npm install
npm run migrate
npm run seed:all
npx nx serve auth-pod

# 3. Web (http://localhost:3001), in another terminal
cd apps/web
cp .env.example .env.local
npm install
npm run dev

# 4. Demo data (API must be running)
cd apps/api
npm run seed:demo
```

Sign in at http://localhost:3001 with:

- Email: `demo@willbe.dev`
- Password: `Demo1234!`

`npm run seed:demo` is re-runnable: it wipes scenarios and campaigns of the demo workspace and recreates account and lead scenarios, four campaigns at different stages with 30 days of backdated activity, and two teammates.

## Checks

```bash
cd apps/api && npx tsc -p apps/auth-pod/tsconfig.app.json --noEmit && npm run smoke
cd apps/web && npx tsc --noEmit && npx next lint && npx jest
```

`npm run smoke` drives the API end to end: login, lead search, campaign creation, enrichment, generation, sending and dashboards.
