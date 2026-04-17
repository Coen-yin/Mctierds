# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### PvP Tiers (`artifacts/pvp-tiers`) — Preview at `/`
Minecraft PvP tier list website. A premium, dark-themed competitive ranking platform similar to mctiers.net.

**Pages:**
- `/` — Leaderboard with game mode tabs (Overall, Vanilla, UHC, Pot, NethOP, SMP, Sword, Axe, Mace), animated rows, player avatars from mc-heads.net
- `/player/:id` — Player profile with tier breakdown per mode, animated bar chart
- `/stats` — Recharts tier distribution, top 5 players, site summary stats

**Design:** Dark gaming aesthetic, gold/amber accent (`#F5A623`), framer-motion animations, Outfit + Space Grotesk fonts, circular tier badges (HT1=gold, LT1=green, LT2=teal, etc.)

**Tech:** React + Vite, TailwindCSS, framer-motion, Recharts, wouter routing, React Query

### API Server (`artifacts/api-server`) — Preview at `/api`
Express 5 backend serving PvP data.

**Routes:**
- `GET /api/players` — list all players (filter by gameMode, region, search)
- `POST /api/players` — create player
- `GET /api/players/:id` — get player
- `PUT /api/players/:id` — update player
- `DELETE /api/players/:id` — delete player
- `GET /api/leaderboard` — ranked leaderboard (filter by gameMode, limit)
- `GET /api/stats/summary` — site stats (totalPlayers, totalRanked, topRegion, recentlyUpdated)
- `GET /api/stats/tier-distribution` — player count by tier

## Database Schema

**players** table:
- id, username (unique), points, rank, region, rank_title, avatar_url, tiers (jsonb), created_at, updated_at

Tiers jsonb structure: `{ overall, vanilla, uhc, pot, nethop, smp, sword, axe, mace }` — each value is "HT1"–"HT3", "LT1"–"LT4", or null

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
