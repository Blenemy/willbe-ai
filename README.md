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

## Deploy

Live demo: https://willbe.topchyidev.shop (`demo@willbe.dev` / `Demo1234!`).

One subdomain serves the whole product. The host nginx terminates HTTPS (certbot) and proxies to an nginx gateway container on `127.0.0.1:8100`, which sends `/auth` to the API and everything else to Next.js. Postgres and Redis stay on the private Docker network, so the stack can share a VPS with other projects.

GitHub Actions builds the images and pushes them to GHCR. The server only pulls and restarts.

| | |
| --- | --- |
| RAM in use | about 350 MB for the whole stack after boot |
| RAM to buy | 2 GB if the VPS runs nothing else |
| CPU | 1 vCPU is enough for a demo |
| Disk | About 1.8 GB for the images; each deploy removes the previous ones |

### One-time server setup

DNS: an A record for the subdomain pointing to the VPS. Docker, Docker Compose, nginx and certbot installed on the host.

```bash
sudo mkdir -p /opt/willbe && sudo chown deploy:deploy /opt/willbe
git clone https://github.com/Blenemy/willbe-ai.git /opt/willbe
cd /opt/willbe
cp deploy/.env.example deploy/.env
chmod 600 deploy/.env
```

In `deploy/.env` set `PUBLIC_URL` (`https://` plus the subdomain), `DB_PASS` and `JWT_SECRET` (`openssl rand -hex 32` for both). The remaining keys run every integration in mock mode; the API refuses to boot without them, so placeholders stay.

Host nginx site, then the certificate:

```bash
sudo cp deploy/host-nginx.conf /etc/nginx/sites-available/willbe
sudo ln -s /etc/nginx/sites-available/willbe /etc/nginx/sites-enabled/willbe
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d willbe.topchyidev.shop --redirect
```

### GitHub

Repository variable:

- `PUBLIC_URL`, the same value as in `deploy/.env`. The web image bakes it in at build time, so changing the domain means a new deploy.

Repository secrets:

- `VPS_HOST`
- `VPS_USER`, a user in the `docker` group that owns `/opt/willbe`
- `VPS_SSH_KEY`, a private key whose public half is in that user's `~/.ssh/authorized_keys`

A push to `main` runs CI. When it passes, Deploy builds `ghcr.io/blenemy/willbe-api` and `willbe-web`, pulls them on the VPS, restarts the stack and waits until both the web app and the API answer. The API container applies migrations and base seeds on every start.

After the first successful deploy, load the demo campaigns once:

```bash
cd /opt/willbe
docker compose --env-file deploy/.env -f docker-compose.prod.yml exec api npm run seed:demo -- http://localhost:3000/auth
```

`seed:all` already created the demo user; `seed:demo` fills scenarios and history. It is safe to run again, and it wipes the demo workspace campaigns first.
