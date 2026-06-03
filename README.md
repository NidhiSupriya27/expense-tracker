# Spendwise — Mini Expense Tracker

> **Studio Graphene Assessment · Exercise 2**
> A full-stack expense tracker built with Node.js + Express + Prisma on the backend and React + TypeScript + Material UI on the frontend.

---

## Live Demo

| Layer | URL |
|-------|-----|
| Frontend | *(deploy to Vercel — see [Deployment](#deployment))* |
| Backend API | *(deploy to Render — see [Deployment](#deployment))* |
| Health Check | `GET /health` |

---

## Features

### Must Have ✅
- Add expense with amount, category, date, and optional note
- View all expenses sorted newest-first with pagination
- Edit any expense via a modal form
- Delete with confirmation dialog
- Filter by category and date range (presets + custom)
- Summary panel: total this month, highest expense, transaction count

### Should Have ✅
- Pie chart and bar chart (Recharts) showing spend by category
- Indian Rupee (₹) currency formatting via `Intl.NumberFormat`
- Full form validation: positive amounts, no future dates, category required

### Bonus ✅
- CSV export of currently filtered rows
- Per-category monthly budget limits (editable)
- Visual budget indicators: progress bars, % used, "over budget" warning chips
- SQLite persistence via Prisma ORM

---

## Architecture Decisions

### Backend — Layered Architecture
```
Route → Controller → Service → Repository → Prisma
```
- **Routes** declare endpoints and attach validation middleware
- **Controllers** are thin — parse input, call service, serialize response
- **Services** contain business logic (aggregation, checks)
- **Repositories** are the only layer that touches Prisma/the database
- **Validators** use Zod schemas; a single `validate()` middleware wires them to routes

### Frontend — Hook-driven, No Global State Manager
State is managed exclusively via `useState`, `useEffect`, `useMemo`, and custom hooks.

**Why each `useMemo`:**
| Hook | Memoized value | Reason |
|------|---------------|--------|
| `useChartData` | `pieData` | O(n) category aggregation; avoids re-running on unrelated re-renders |
| `useChartData` | `barData` | Derived from `pieData`; avoids a second pass |
| `ExpenseTable` | `sortedExpenses` | Client-side sort of current page |

---

## Tech Stack

| Layer | Library | Why |
|-------|---------|-----|
| Backend runtime | Node.js + Express | Specified in brief |
| ORM | Prisma | Type-safe queries, SQLite support |
| DB | SQLite | Zero-config persistence |
| Backend validation | Zod | Schema-first, co-located with TypeScript types |
| Frontend bundler | Vite | Fast HMR, first-class TypeScript |
| UI library | Material UI v5 | Comprehensive, accessible component set |
| Forms | React Hook Form + Zod | Minimal re-renders |
| Charts | Recharts | React-native, responsive |
| Date handling | Day.js | Lightweight |
| HTTP client | Axios | Interceptors for centralised error normalisation |
| Testing | Vitest | Same config as Vite, Jest-compatible API |

---

## Project Structure

```
expense-tracker/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # LoadingState, ErrorState, EmptyState, ConfirmDialog, CategoryChip
│   │   │   ├── expense/        # SummaryCards, FiltersBar, ExpenseTable, ExpenseForm
│   │   │   ├── budget/         # BudgetPanel
│   │   │   └── charts/         # SpendingPieChart, CategoryBarChart
│   │   ├── hooks/              # useExpenses, useSummary, useBudgets, useChartData
│   │   ├── layouts/            # AppShell (header + page wrapper)
│   │   ├── pages/              # Dashboard (assembles all components)
│   │   ├── services/           # api.client.ts (Axios), expense.service.ts
│   │   ├── types/              # Shared TypeScript interfaces
│   │   ├── utils/              # formatCurrency, formatDate, exportToCSV, theme, validation
│   │   └── constants/          # Categories, colors, date-range options
│   └── vite.config.ts
│
├── server/                     # Express backend
│   ├── prisma/
│   │   └── schema.prisma       # Expense + Budget models
│   ├── src/
│   │   ├── controllers/        # Thin HTTP handlers
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # Prisma data access
│   │   ├── routes/             # Express routers
│   │   ├── middleware/         # errorHandler, validate
│   │   ├── validators/         # Zod schemas
│   │   ├── types/              # Shared server types
│   │   ├── utils/              # prisma.client singleton
│   │   └── app.ts              # Express entry point
│   └── tsconfig.json
│
├── render.yaml
├── .gitignore
└── README.md
```

---

## API Documentation

### Base URL
```
http://localhost:3001   (development)
```

### Expenses

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/expenses` | List expenses (paginated, filterable) |
| `GET` | `/api/expenses/:id` | Get single expense |
| `POST` | `/api/expenses` | Create expense |
| `PUT` | `/api/expenses/:id` | Update expense |
| `DELETE` | `/api/expenses/:id` | Delete expense |

#### `GET /api/expenses` query params
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `startDate` | YYYY-MM-DD | From date (inclusive) |
| `endDate` | YYYY-MM-DD | To date (inclusive) |
| `page` | number | Page (default: 1) |
| `pageSize` | number | Per page (default: 20, max: 100) |

#### `POST /api/expenses` body
```json
{ "amount": 450.00, "category": "Food", "date": "2024-03-15", "note": "Groceries" }
```

### Summary & Budgets

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/summary` | Monthly KPIs |
| `GET` | `/api/budgets` | All budget records |
| `GET` | `/api/budgets/with-spend` | Budgets + current-month spend |
| `PUT` | `/api/budgets` | Upsert budget limits |

### Error shape
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

---

## Setup Instructions

> **Prerequisites:** Node.js ≥ 18. Nothing else.

### 1. Clone and enter the project
```bash
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker
```

### 2. Backend setup
```bash
cd server

# Install dependencies
npm install

# Copy env file (defaults work for local dev, no changes needed)
cp .env.example .env

# Generate Prisma client AND create the SQLite tables in one command
npm run db:setup
# This runs: prisma generate + prisma db push + seed script

# Start the dev server
npm run dev
# → http://localhost:3001
```

> **What `db:setup` does:**
> - `prisma generate` — compiles the Prisma client from schema.prisma
> - `prisma db push` — creates the SQLite file and all tables directly from the schema (no migration files needed for local dev)
> - `ts-node src/prisma/seed.ts` — inserts 30 sample expenses and 7 budget limits

> **Why `db push` instead of `migrate deploy`?**
> `migrate deploy` only applies *existing* migration files. Since this repo ships without a `prisma/migrations/` folder (migrations are generated per-environment), `db push` is the correct command for first-time local setup. For production on Render, `prisma migrate dev --name init` generates the migration files which `migrate deploy` can then apply.

### 3. Frontend setup
```bash
# New terminal, from project root:
cd client

npm install

cp .env.example .env
# VITE_API_BASE_URL=http://localhost:3001 — correct by default

npm run dev
# → http://localhost:5173
```

### 4. Verify it's working
- Open http://localhost:5173 — you should see the dashboard with seeded data
- Open http://localhost:3001/health — should return `{"status":"ok",...}`

---

## Environment Variables

### Server (`server/.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite file path (relative to `server/prisma/`) |
| `PORT` | `3001` | Express port |
| `NODE_ENV` | `development` | `development` or `production` |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |

### Client (`client/.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3001` | Backend base URL |

---

## Running Tests

```bash
# Backend (validator + summary service unit tests)
cd server && npm test

# Frontend (SummaryCards, utility functions, useChartData hook)
cd client && npm test
```

---

## Deployment

### Backend → Render (free tier)

1. Push repo to GitHub
2. Create a **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command:** `cd server && npm install && npx prisma generate && npx prisma migrate dev --name init`
   - **Start Command:** `cd server && npm run start`
4. Add env vars in Render dashboard:
   ```
   NODE_ENV=production
   DATABASE_URL=file:./prod.db
   CORS_ORIGIN=https://<your-vercel-url>
   ```

### Frontend → Vercel (free tier)

```bash
cd client
npx vercel
```
Set `VITE_API_BASE_URL=https://<your-render-url>` in the Vercel dashboard, then redeploy.

---

## Next Steps

1. **Authentication** — JWT so multiple users can have separate histories
2. **Recurring expenses** — Mark bills as recurring; auto-create monthly entries
3. **Trend line** — Weekly spend overlaid on the bar chart
4. **Data import** — Parse bank statement CSV and auto-categorise
5. **E2E tests** — Playwright covering the full add/edit/delete/filter flow
6. **Rate limiting** — `express-rate-limit` on the API
7. **Docker** — `docker-compose.yml` so reviewers can spin up with one command

---

*Built for Studio Graphene's Full Stack Developer assessment.*
