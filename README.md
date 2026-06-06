# NM Finance Tracker

Mobile-first finance tracker built with Next.js 16, React 19, Neon Postgres,
Drizzle ORM, and Auth.js Google authentication.

Read [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) to learn the full
authentication flow and how the project code is connected.

## Getting Started

Create `.env.local` from `.env.example`, then run the database migration:

```bash
npm run db:generate
npm run db:migrate
```

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Google OAuth local callback URL:

```txt
http://localhost:3000/api/auth/callback/google
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:migrate
```

## Key Folders

- `src/app/sign-in` - custom Google sign-in page
- `src/app/(finance)` - protected finance app
- `src/app/api/auth/[...nextauth]` - Auth.js route handlers
- `src/db/schema.ts` - Auth.js and finance schema
- `src/lib` - data access, auth helpers, formatting, analytics

## Deploy

Set the same environment variables from `.env.example` on your hosting platform.
Add the production Google callback URL before testing deployed login.
