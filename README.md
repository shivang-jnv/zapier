# Zapier Clone: Event-Driven Automation Platform

This repository implements a distributed, event-driven automation platform heavily inspired by Zapier. It enables users to define custom workflows ("Zaps") that trigger on incoming webhooks and execute a sequence of asynchronous actions, such as sending emails or executing Solana blockchain transactions.

## System Architecture

The platform adopts a microservices architecture, decoupled via a message broker (Kafka) and a relational database (PostgreSQL).

### Service Topology

1. **`frontend` (Next.js / React)**  
   Client-facing application for user authentication, workflow creation, and observability.
2. **`backend-primary` (Express.js / Node.js)**  
   Core REST API serving the frontend. Handles JWT-based authentication and CRUD operations for workflows (Zaps, Triggers, and Actions).
3. **`hooks` (Express.js / Node.js)**  
   High-throughput ingestion layer. Acts as the public webhook receiver that triggers Zap executions.
4. **`processor` (Node.js)**  
   Background daemon implementing the **Transactional Outbox Pattern**. It polls the database for pending webhook events and safely publishes them to Kafka.
5. **`worker` (Node.js)**  
   Scalable execution engine. Consumes tasks from Kafka and executes the integrations (Nodemailer, Solana Web3.js) sequentially.

---

## Architectural Decisions & Trade-offs (Why X over Y?)

As a distributed system, several architectural trade-offs were made favoring reliability, scalability, and loose coupling over strict simplicity.

### 1. The Transactional Outbox Pattern (PostgreSQL over Direct Kafka Publishing)
**Decision**: In the `hooks` service, webhook payloads are written to a `ZapRunOutbox` table in Postgres using an atomic database transaction, rather than publishing directly to Kafka. The `processor` then tails this table and dispatches messages to Kafka.

**Why X over Y?**: 
- *Resilience*: Publishing directly to Kafka within the HTTP request handler introduces a hard dependency on the broker's availability. If Kafka goes down or experiences a partition election, incoming webhooks would fail and data would be irrevocably lost. By writing to Postgres first, we guarantee **at-least-once delivery**. Even during a Kafka outage, our API successfully accepts webhooks, which queue safely in the database until the broker recovers.

### 2. Event-Driven Architecture (Kafka over Synchronous HTTP/RPC)
**Decision**: The `worker` execution engine processes actions asynchronously via Kafka topics rather than the `hooks` service synchronously calling the actions over HTTP or RPC.

**Why X over Y?**: 
- *Decoupling & Latency*: Executing a 3rd-party API call (e.g., sending an email or connecting to the Solana chain) can take several seconds and is prone to timeouts. If done synchronously, the webhook caller would be blocked, severely degrading the throughput of the `hooks` service. By bridging via Kafka, webhook ingestion resolves in milliseconds.
- *Scalability*: During a traffic spike, the webhook receiver scales independently of the slower background workers. The queue acts as a buffer (shock absorber) to handle burst loads.

### 3. Dedicated Microservices (Poly-service over Monolith)
**Decision**: Splitting the system into discrete runtimes (`backend-primary`, `hooks`, `processor`, `worker`) instead of a single monolithic Express server.

**Why X over Y?**: 
- *Resource Isolation*: Node.js is single-threaded. CPU-intensive operations or blocking I/O in the `worker` (like crypto-signing for Solana) must not block the event loop handling HTTP ingestion in the `hooks` service. 
- *Optimized Deployment*: We can provision cheap, lightweight containers for the `hooks` API (which needs high concurrency and high memory limits) and specialized instances for the `worker` engine without over-provisioning the entire stack.

### 4. Prisma as the ORM
**Decision**: Implementing Prisma for database interactions across all Node ecosystem services over raw SQL templates or traditional query builders like Knex.

**Why X over Y?**: 
- *Type Safety at Boundaries*: Prisma propagates strict database schema types to our TypeScript domain logic natively, catching SQL drift at compile time. While raw SQL offers more control on heavily optimized queries, our current bounds are network I/O and message queuing, making Prisma's developer velocity and safety the right trade-off.

---

## 🚀 Local Development Setup

The application is developed as independent services sharing a PostgreSQL database and Kafka broker. 

### Prerequisites

* Node.js (v18+)
* PostgreSQL instance
* Kafka local broker (`localhost:9092`)

### 1. Environment Configuration

All Prisma-dependent services (`backend-primary`, `hooks`, `processor`, `worker`) require a valid `.env` file pointing to the same Postgres database.

```bash
# Example .env (Required in each service directory)
DATABASE_URL="postgresql://user:password@localhost:5432/zapier"
```

**Service-specific variables:**
*   `backend-primary/`: `JWT_PASSWORD`
*   `worker/`: `SOL_PRIVATE_KEY` (base58) and `SMTP_ENDPOINT`/`SMTP_USERNAME`/`SMTP_PASSWORD`

### 2. Database Migrations

Run migrations from any database-connected service (e.g., `backend-primary`) to establish schemas:
```bash
cd backend-primary
npx prisma generate
npx prisma migrate dev
```
*(Ensure to run `npx prisma generate` in all other backend directories to build their local Prisma clients).*

### 3. Running the Stack

Install dependencies in each folder, then launch them in separate terminal sessions:

```bash
# 1. Primary API (Ports to 3000)
cd backend-primary && npm run dev

# 2. Webhook Ingestion (Ports to 3002)
cd hooks && npm run dev

# 3. Outbox Processor
cd processor && npm run dev

# 4. Execution Worker
cd worker && npm run dev

# 5. Frontend Client
cd frontend && npm run dev
```

> **Note on Ports**: The Next.js `frontend` and the Express `backend-primary` default to port `3000`. Adjust your environment or `next.config.ts` to map the frontend to `3001` or another available port.

---

## Known Edges & Scalability Limits

As the system scales, technical debt to address includes:
1.  **Outbox Polling Bottleneck**: The `processor` currently relies on active Postgres polling. At immense scale, this should transition to **Change Data Capture (CDC)** using Postgres logical replication (e.g., Debezium) for lower latency and database load.
2.  **Idempotency & Retries**: Retries in the `worker` service should be strictly idempotent. Implementing a distributed lock or idempotency key store (like Redis) is required to prevent double-spending in Solana transactions during Kafka at-least-once message redeliveries.
