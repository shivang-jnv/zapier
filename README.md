# Zapier Clone (Cohort Project)

This repository contains a small, multi-service “Zapier-like” automation system.

It’s split into:

- **`frontend/`** (Next.js) — UI to sign up/login, create zaps, and list them.
- **`backend-primary/`** (Express + Prisma) — primary API for auth and zap CRUD.
- **`hooks/`** (Express + Prisma) — webhook ingestion service that creates `ZapRun` + `ZapRunOutbox` rows.
- **`processor/`** (Node + Prisma + Kafka) — outbox processor that publishes work to Kafka.
- **`worker/`** (Node + Prisma + Kafka) — Kafka worker that executes actions (email / Solana).

The runtime pattern is:

1. A zap is created via `backend-primary`.
2. A webhook is called on `hooks`.
3. `hooks` stores a `ZapRun` and an outbox row in Postgres in a single transaction.
4. `processor` polls the outbox table and publishes `{ zapRunId, stage }` messages to Kafka.
5. `worker` consumes Kafka messages and executes actions in order (`stage` = `sortingOrder`).

---

## Services and Ports

- **Frontend**: Next.js dev server (default `http://localhost:3000`)
- **Backend API (`backend-primary`)**: Express server on **`http://localhost:3000`** (hardcoded)
- **Hooks (`hooks`)**: Express server on **`http://localhost:3002`** (hardcoded)
- **Kafka**: `localhost:9092` (hardcoded in `processor` and `worker`)

Important:

- You can’t run **frontend** and **backend-primary** on port `3000` at the same time without changing one of them.

---

## Tech Stack

- **TypeScript** (compiled with `tsc`)
- **Express** (backend services)
- **Next.js** (frontend)
- **Prisma** (Postgres ORM)
- **KafkaJS** (Kafka producer/consumer)
- **Nodemailer** (email action)
- **Solana Web3.js** (SOL transfer action)

---

## Prerequisites

- **Node.js** (recommended: Node 18+)
- **PostgreSQL** database
- **Kafka** broker running locally on `localhost:9092`

---

## Environment Variables

All Prisma-backed services require:

- **`DATABASE_URL`** — Postgres connection string used by Prisma.

Other service-specific variables:

### `backend-primary/`
- **`JWT_PASSWORD`** — JWT secret (defaults to `123random` if unset).

### `worker/`
- **`SOL_PRIVATE_KEY`** — base58-encoded Solana private key (required for `send-sol` action).
- **`SMTP_ENDPOINT`**, **`SMTP_USERNAME`**, **`SMTP_PASSWORD`** — required if you enable the email action.

Notes:

- This repo contains `.env` files locally, but they are **gitignored**, so you must create your own `.env` in each service directory.

---

## Install Dependencies

This repo is not a monorepo with a single root `package.json`. Install per service:

```bash
# in each folder: backend-primary, hooks, processor, worker, frontend
npm install
```

---

## Database / Prisma Setup

Each service has its own `prisma/schema.prisma`.

Typical workflow (per service that uses Prisma):

```bash
npx prisma generate
npx prisma migrate dev
```

Important:

- Ensure all services point to the **same Postgres database** if you expect end-to-end behavior.
- Watch out for **schema drift**: schemas differ slightly between services (e.g., `backend-primary` has `userId` on `Zap`).

---

## Running Locally

Because services are independent, you generally run each in a separate terminal.

### 1) Start backend-primary (API)

```bash
npm run dev
```

Location: `backend-primary/`

### 2) Start hooks (webhook receiver)

```bash
npm run dev
```

Location: `hooks/`

### 3) Start processor (outbox → Kafka)

```bash
npm run dev
```

Location: `processor/`

### 4) Start worker (Kafka → actions)

```bash
npm run dev
```

Location: `worker/`

### 5) Start frontend (Next.js)

```bash
npm run dev
```

Location: `frontend/`

---

## Frontend Configuration

The frontend uses `frontend/app/config.ts`:

- `BACKEND_URL` (defaults to `http://localhost:3000`)
- `HOOKS_URL` (currently set to `https://localhost:3002`)

Note:

- The hooks service is plain HTTP by default, so `HOOKS_URL` likely needs to be `http://localhost:3002`.

---

## Known Sharp Edges / Common Failure Points

- **Port conflict**: `frontend` and `backend-primary` both default to port `3000`.
- **Kafka required**: `processor` and `worker` assume `localhost:9092`.
- **Schema differences**: Prisma schemas differ between services; make sure your DB schema matches what the running services expect.
- **Worker action helpers**:
  - Email sending is currently commented out in `worker/src/index.ts`.
  - Solana transfers require a valid `SOL_PRIVATE_KEY`.

---

## Repository Structure

```text
zapier/
  backend-primary/
  hooks/
  processor/
  worker/
  frontend/
```
