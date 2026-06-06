import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  LockKeyhole,
  PieChart,
  Smartphone,
  Sparkles,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-first tracking",
    text: "Add income and expenses quickly from a clean thumb-friendly workspace.",
  },
  {
    icon: PieChart,
    title: "Instant clarity",
    text: "See balance, top category, max expense, and monthly summaries at a glance.",
  },
  {
    icon: Download,
    title: "Export-ready reports",
    text: "Download polished monthly summaries as PDF or Excel whenever you need them.",
  },
];

const activity = [
  ["Salary", "+ Rs 58,000", "Income"],
  ["Rent", "- Rs 14,000", "Housing"],
  ["Groceries", "- Rs 3,250", "Food"],
];

export default async function HomePage() {
  const session = await auth();
  const primaryHref = session?.user ? "/dashboard" : "/sign-in";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbf8] text-slate-950">
      <section className="relative min-h-[92vh] px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f7fbf8_0%,#eef8f2_48%,#f8fafc_100%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col">
          <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid size-9 place-items-center rounded-full bg-slate-950 text-white">
                <WalletCards size={18} />
              </span>
              NM Finance
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="#features" className="hover:text-slate-950">
                Features
              </a>
              <a href="#reports" className="hover:text-slate-950">
                Reports
              </a>
              <a href="#security" className="hover:text-slate-950">
                Security
              </a>
            </nav>

            <Link href={primaryHref} className="button-primary min-h-10">
              {session?.user ? "Dashboard" : "Sign in"}
            </Link>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
            <div className="animate-in max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                <Sparkles size={16} />
                Built for clear personal finance habits
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold sm:text-6xl lg:text-7xl">
                Money tracking that feels calm, fast, and personal.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                NM Finance Tracker gives you a focused dashboard for income,
                expenses, balance, and monthly reports with a mobile-first
                experience that feels ready for daily use.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="button-primary justify-center sm:justify-start"
                >
                  {session?.user ? "Open dashboard" : "Start with Google"}
                  <ArrowRight size={18} />
                </Link>
                <a href="#reports" className="button-soft justify-center">
                  See report experience
                </a>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                {["Private data", "Fast entries", "Clean exports"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-white/80 bg-white/80 p-4 text-sm font-semibold shadow-sm"
                    >
                      <CheckCircle2
                        className="mb-3 text-emerald-600"
                        size={18}
                      />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="animate-in relative">
              <div className="mx-auto max-w-[25rem] rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-emerald-950/20 sm:max-w-[28rem]">
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">
                        This Month
                      </p>
                      <p className="mt-1 text-2xl font-semibold">Rs 38,750</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      +12%
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">Income</p>
                      <p className="mt-2 font-semibold text-emerald-700">
                        Rs 72,400
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">Expenses</p>
                      <p className="mt-2 font-semibold text-rose-700">
                        Rs 33,650
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Spending rhythm</p>
                      <BarChart3 size={18} className="text-slate-400" />
                    </div>
                    <div className="mt-4 flex h-32 items-end gap-2">
                      {[32, 62, 46, 80, 58, 92, 70].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-xl bg-emerald-500/80"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {activity.map(([name, amount, type]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-semibold">{name}</p>
                          <p className="text-xs text-slate-500">{type}</p>
                        </div>
                        <p
                          className={`text-sm font-semibold ${
                            amount.startsWith("+")
                              ? "text-emerald-700"
                              : "text-rose-700"
                          }`}
                        >
                          {amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-700">Experience</p>
            <h2 className="mt-2 text-4xl font-semibold">
              Designed around the moments you actually track money.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="panel p-6">
                <feature.icon className="text-emerald-600" size={28} />
                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reports" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-lg bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div>
            <p className="text-sm font-semibold text-emerald-300">Reports</p>
            <h2 className="mt-3 text-4xl font-semibold">
              A monthly document, not just a dashboard widget.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Reports are structured for reviewing, saving, and sharing with
              export actions for PDF and Excel.
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 text-slate-950">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm text-slate-500">Monthly statement</p>
                <h3 className="text-2xl font-semibold">June Summary</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                Ready
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Income", "Expense", "Balance"].map((item, index) => (
                <div key={item} className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">{item}</p>
                  <p className="mt-2 font-semibold">
                    {["Rs 72,400", "Rs 33,650", "Rs 38,750"][index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-12 place-items-center rounded-lg bg-slate-950 text-white">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                Private by default.
              </h2>
              <p className="mt-1 max-w-2xl text-slate-600">
                Google authentication and user-scoped database queries keep each
                user inside their own finance workspace.
              </p>
            </div>
          </div>
          <Link href={primaryHref} className="button-primary justify-center">
            {session?.user ? "Go to app" : "Create your workspace"}
          </Link>
        </div>
      </section>
    </main>
  );
}
