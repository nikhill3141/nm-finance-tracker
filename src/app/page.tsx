import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-950">
      <section className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            NM Finance Tracker
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Track income, expenses, balance, and monthly reports.
          </h1>
          <p className="max-w-2xl text-lg text-gray-600">
            A full stack finance tracker built with Next.js, Neon PostgreSQL,
            Drizzle ORM, Server Actions, and API Route Handlers.
          </p>
        </div>

        <div>
          <Link
            href="/dashboard"
            className="inline-flex rounded-md bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
