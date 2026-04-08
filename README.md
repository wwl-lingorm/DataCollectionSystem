# DataCollectionSystem

Modular backend scaffold for Yunnan enterprise employment-unemployment data collection system.

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

## Current API examples

- `POST /api/v1/auth/login`
- `POST /api/v1/enterprise/filings`
- `POST /api/v1/enterprise/reports`
- `GET /api/v1/city/filings/pending`
- `PATCH /api/v1/city/filings/:filingId/approve`
- `GET /api/v1/province/reports/summary`
- `POST /api/v1/notice/publish`
- `POST /api/v1/exchange/push-national`

## Next steps

- Replace in-memory repositories with database repositories.
- Add role-based access control and JWT verification middleware.
- Add unit tests and integration tests for each module.
- Split province report service into indicators and chart data endpoints.
