# NM Finance Tracker Authentication Guide

This v1 uses Auth.js with Google OAuth, Drizzle ORM, and Neon Postgres.

## What Was Added

- Google login with Auth.js in `src/auth.ts`.
- Auth route handlers in `src/app/api/auth/[...nextauth]/route.ts`.
- Next.js 16 route protection in `src/proxy.ts`.
- Auth tables in `src/db/schema.ts`: `user`, `account`, `session`, and `verificationToken`.
- `user_id` ownership fields on `incomes` and `expenses`.
- Server-side session helpers in `src/lib/auth-session.ts`.
- A custom mobile-first sign-in page at `src/app/sign-in/page.tsx`.
- A protected finance layout with desktop sidebar, mobile bottom navigation, avatar, and sign out.

## Full Login Flow

1. The user opens `/`.
2. `src/app/page.tsx` checks `auth()`.
3. If the user is signed in, they go to `/dashboard`.
4. If not, they go to `/sign-in`.
5. The user taps `Continue with Google`.
6. The sign-in form calls `signIn("google")` from `src/auth.ts`.
7. Auth.js redirects the user to Google.
8. Google redirects back to `/api/auth/callback/google`.
9. Auth.js creates or updates rows in `user`, `account`, and `session`.
10. Auth.js stores a secure session cookie.
11. The user returns to `/dashboard`.
12. Finance data is queried with the current `session.user.id`.

## Route Protection

The project uses `src/proxy.ts`, not `middleware.ts`, because this project runs on Next.js 16.

Protected routes:

- `/dashboard`
- `/incomes`
- `/expenses`
- `/reports`

The `authorized` callback in `src/auth.ts` decides whether a request may continue. The finance layout also checks `auth()` and redirects to `/sign-in` if no user exists.

## Data Protection

The important rule is this:

```ts
where(and(eq(incomes.id, id), eq(incomes.userId, userId)))
```

Every income and expense read, update, and delete includes the current user's id. That prevents one signed-in user from seeing or changing another user's finance records.

The UI is protected, but the API routes are also protected. This is required because someone can call `/api/incomes` directly without using the app UI.

## Google OAuth Setup

In Google Cloud Console:

1. Create or choose a Google Cloud project.
2. Open `APIs & Services`.
3. Configure the OAuth consent screen.
4. Create an OAuth Client ID.
5. Choose `Web application`.
6. Add this authorized redirect URI for local development:

```txt
http://localhost:3000/api/auth/callback/google
```

7. Add your production callback later:

```txt
https://your-domain.com/api/auth/callback/google
```

8. Copy the Client ID and Client Secret into `.env.local`:

```env
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

## Required Environment Variables

```env
DATABASE_URL="..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_URL="http://localhost:3000"
```

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

## Database Migration

After schema changes:

```bash
npm run db:generate
npm run db:migrate
```

If your `incomes` or `expenses` tables already contain old rows, the migration assigns them to a placeholder user named `legacy-local-user`. Those old rows are preserved, but they will not appear for a real Google-authenticated user because the app only queries rows owned by the signed-in user's id.

## How To Read The Code

Start here:

1. `src/auth.ts` - Auth.js provider, adapter, session callback, and route authorization.
2. `src/db/schema.ts` - Auth tables plus finance tables.
3. `src/lib/auth-session.ts` - Small helpers for getting the current user id.
4. `src/lib/incomes.ts` and `src/lib/expenses.ts` - User-scoped database functions.
5. `src/app/(finance)/layout.tsx` - Protected app shell and sign out.
6. `src/app/sign-in/page.tsx` - Custom Google sign-in UI.
7. `src/app/api/incomes` and `src/app/api/expenses` - API-level auth checks.

## UI Decisions

The app is mobile-first because finance tracking is likely to happen on a phone.

- Mobile uses transaction cards instead of tables.
- Desktop still gets full tables.
- Primary actions are large and touch-friendly.
- The bottom navigation keeps core routes reachable by thumb.
- Shared CSS classes in `globals.css` keep buttons, panels, forms, focus states, and motion consistent.

## Production Checklist

- Add real Google credentials to `.env.local`.
- Generate a strong `AUTH_SECRET`.
- Run the database migration.
- Test login locally at `http://localhost:3000/sign-in`.
- Add the production callback URL in Google Cloud before deployment.
- Add all environment variables to Vercel or your hosting platform.
