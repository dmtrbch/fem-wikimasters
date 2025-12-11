# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wikimasters is a Next.js 16 wiki application with Stack Auth for authentication, Neon PostgreSQL for data storage, and AI-powered article summarization.

## Development Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build with Turbopack
npm run lint         # Run Biome linter
npm run lint:fix     # Auto-fix lint issues
npm run typecheck    # TypeScript type checking
```

## Testing Commands

```bash
npm run test              # Run unit tests (Vitest)
npm run test:watch        # Unit tests in watch mode
npx vitest -t "test name" # Run specific unit test

npm run test:e2e          # Run Playwright E2E tests
npm run test:e2e:ui       # E2E tests with UI mode
npm run test:e2e:debug    # E2E tests with debugger
npx playwright test -g "pattern"  # Run specific E2E test
```

## Database Commands

```bash
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

## Architecture

### Stack Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (nav/, ui/, wiki-*)
- `src/db/` - Drizzle ORM schema and database connection
- `src/stack/` - Stack Auth client/server configuration
- `src/ai/` - AI summarization service using Vercel AI SDK
- `src/cache/` - Upstash Redis caching
- `src/email/` - Email templates with Resend

### Key Integrations

**Authentication**: Stack Auth (`@stackframe/stack`)
- Server: `src/stack/server.tsx` - `stackServerApp`
- Client: `src/stack/client.tsx` - `stackClientApp`
- Wraps app in `StackProvider` in root layout

**Database**: Neon PostgreSQL with Drizzle ORM
- Schema: `src/db/schema.ts` - articles table with usersSync reference
- Connection: `src/db/index.ts` - exports `db` instance

**AI**: Article summarization via Vercel AI SDK
- `src/ai/summarize.ts` - generates summaries, returns mock in test env

### Testing Architecture

**Unit tests** (Vitest): `test/unit/`
- Uses happy-dom environment
- Setup file mocks next/navigation and AI service
- Path alias `@/` resolves to `src/`

**E2E tests** (Playwright): `test/e2e/`
- Global setup creates isolated Neon database branch
- Auth setup saves session to `playwright/.auth/user.json`
- Two projects: authenticated (article tests) and unauthenticated (auth flow tests)

### Environment Variables

Required (see `.env.example`):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_STACK_PROJECT_ID`, `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`, `STACK_SECRET_SERVER_KEY` - Stack Auth
- `BLOB_READ_WRITE_TOKEN`, `BLOB_BASE_URL` - Vercel Blob storage
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - Redis cache
- `AI_GATEWAY_API_KEY` - AI summarization
- `RESEND_API_KEY` - Email service

## Code Style

- Biome for linting/formatting (2-space indent)
- TypeScript strict mode
- Path alias: `@/*` → `./src/*`
