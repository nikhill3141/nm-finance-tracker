# NM Finance Tracker V1 Guide

This project is a mobile-first personal cash flow tracker built with Next.js App Router, Auth.js, Drizzle ORM, and Neon/Postgres.

## Core Flow

1. The landing page at `/` is static and public.
2. The sign-in page at `/sign-in` starts Google authentication.
3. Auth.js stores users, accounts, and sessions in the database.
4. Protected finance routes require a signed-in user before showing data.
5. Income, expense, dashboard, and report queries are scoped by `user_id`.

## Authentication Files

- `src/auth.ts`: Auth.js provider, adapter, and session callbacks.
- `src/proxy.ts`: protects dashboard, income, expense, report, and sign-in routes.
- `src/app/api/auth/[...nextauth]/route.ts`: Auth.js route handler.
- `src/lib/auth-session.ts`: small helpers for reading or requiring the current user.

## Expense Payment Mode

Expenses now support `cash` or `online` payment modes.

- `src/db/schema.ts`: defines the `expense_payment_mode` enum and `payment_mode` column.
- `drizzle/0002_small_thundra.sql`: database migration that adds the enum and defaults existing rows to `cash`.
- `src/lib/expenses.ts`: create and update functions now require `paymentMode`.
- `src/app/(finance)/expenses/create/page.tsx`: new cash/online selector.
- `src/app/(finance)/expenses/[id]/edit/page.tsx`: edit flow keeps the selected payment mode.
- `src/app/api/expenses/route.ts`: API create validates payment mode.
- `src/app/api/expenses/[id]/route.ts`: API update validates payment mode.

## Duplicate Submit Protection

`src/components/submit-button.tsx` uses `useFormStatus()` to disable the save button while the server action is pending. This prevents repeated taps from creating duplicate expenses.

## Dashboard

`src/lib/analytics.ts` calculates:

- total income
- total expenses
- balance
- cash expenses
- online expenses
- max expense
- top category
- record counts

`src/app/(finance)/dashboard/page.tsx` renders these values with icon cards and a dark-mode toggle.

## Reports And Exports

`src/app/(finance)/reports/page.tsx` renders a paper-style statement table with:

- date
- type
- description
- source or category
- payment mode
- signed amount

`src/app/(finance)/reports/report-export-actions.tsx` exports the same table as:

- PDF, using `jspdf`
- Excel-compatible SpreadsheetML XML, downloaded as `.xls`

## Navigation Performance

The finance shell uses `Link` prefetching, and `src/app/(finance)/loading.tsx` gives dynamic routes an instant skeleton state while data loads.

## Deployment Notes

For Vercel, use:

```bash
npm run build
```

Set the production app URL in Auth.js related environment variables, then add the same production callback URL in Google Cloud:

```text
https://your-domain.vercel.app/api/auth/callback/google
```

## Verification Commands

These passed after the latest changes:

```bash
npm run db:generate
npm run db:migrate
npm run lint
npm run build
```
