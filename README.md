# DataCollectionSystem

Modular backend scaffold for Yunnan enterprise employment-unemployment data collection system.

## Frontend

The `client/` folder now contains a role-aware React SPA with:

- Login and demo accounts
- Enterprise, city, and province workspaces
- Cross-role view switching in the top bar
- Subpages for filing, review, summary, and analysis flows
- Slide-over drawers for record details and workflow traceability
- Notice center, exchange center, and system settings pages
- Responsive layout and a custom visual theme

## Tech stack

- Node.js + Express
- TypeScript
- Zod (request validation)

## Layered structure

```
src/
  app.ts
  server.ts
  shared/
    config/
    errors/
    middlewares/
  modules/
    auth/
    enterprise/
    city/
    province/
    notice/
    exchange/
```

Each module follows:

- `*.routes.ts`: route registration
- `*.controller.ts`: HTTP boundary
- `*.service.ts`: business rules
- `*.repository.ts`: persistence abstraction (currently in-memory)
- `*.types.ts`: domain models

## Run

```bash
npm install
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

Or from the repository root:

```bash
npm run dev:client
```

## Automated tests

Backend tests (Vitest + Supertest):

```bash
npm test
```

Frontend tests (Vitest + React Testing Library):

```bash
cd client
npm test
```

Watch mode:

```bash
npm run test:watch
cd client
npm run test:watch
```

## Current API examples

- `GET /api/v1/enterprise/dashboard`
- `GET /api/v1/enterprise/filings/:filingId`
- `GET /api/v1/enterprise/reports/:reportId`
- `GET /api/v1/city/dashboard`
- `GET /api/v1/city/filings/decisions`
- `GET /api/v1/province/dashboard`
- `POST /api/v1/auth/login`
- `POST /api/v1/enterprise/filings`
- `POST /api/v1/enterprise/reports`
- `GET /api/v1/city/filings/pending`
- `PATCH /api/v1/city/filings/:filingId/approve`
- `GET /api/v1/province/reports/summary`
- `POST /api/v1/notice/publish`
- `POST /api/v1/exchange/push-national`

## Frontend routes

- `/login`
- `/app/enterprise/home`
- `/app/enterprise/filing/overview`
- `/app/enterprise/filing/basic`
- `/app/enterprise/filing/history`
- `/app/enterprise/reports/overview`
- `/app/enterprise/reports/submit`
- `/app/enterprise/reports/history`
- `/app/city/home`
- `/app/city/review/queue`
- `/app/city/review/decisions`
- `/app/city/review/flow`
- `/app/province/home`
- `/app/province/summary/overview`
- `/app/province/summary/export`
- `/app/province/summary/comparison`
- `/app/province/analysis/trend`
- `/app/province/analysis/alerts`
- `/app/province/analysis/district`
- `/app/:role/notices`
- `/app/:role/exchange`
- `/app/province/settings`

## Next steps

- Replace in-memory repositories with database repositories.
- Add role-based access control and JWT verification middleware.
- Add unit tests and integration tests for each module.
- Split province report service into indicators and chart data endpoints.
