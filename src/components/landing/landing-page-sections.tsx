import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CreditCard,
  FileText,
  Gauge,
  LineChart,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  VectorSquareIcon,
  Wallet,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

const metrics = [
  {
    label: "Balance",
    value: "Rs 38,750",
    icon: Wallet,
    tone: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/35",
  },
  {
    label: "Cash expenses",
    value: "Rs 11,800",
    icon: Banknote,
    tone: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/35",
  },
  {
    label: "Online expenses",
    value: "Rs 21,850",
    icon: CreditCard,
    tone: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/35",
  },
];

const activity = [
  { label: "Salary", date: "08 Jun", mode: "Income", amount: "+ Rs 58,000" },
  { label: "Rent", date: "05 Jun", mode: "Cash", amount: "- Rs 14,000" },
  {
    label: "Groceries",
    date: "02 Jun",
    mode: "Online",
    amount: "- Rs 3,250",
  },
];

const featureTiles = [
  {
    title: "Cash and online split",
    text: "Separate daily spending by payment mode so the dashboard matches real life.",
    icon: CreditCard,
    tone: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-950/35",
  },
  {
    title: "Statement reports",
    text: "Review clean report tables and export them as PDF or Excel-compatible files.",
    icon: FileText,
    tone: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/35",
  },
  {
    title: "Mobile daily entry",
    text: "Thumb-friendly controls keep income and expense tracking quick on small screens.",
    icon: Gauge,
    tone: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/35",
  },
  {
    title: "Private workspace",
    text: "Google sign-in and user-scoped queries keep every record attached to one account.",
    icon: LockKeyhole,
    tone: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/35",
  },
];

type LandingActionProps = {
  primaryHref: string;
  isSignedIn: boolean;
};

export function LandingHero({ primaryHref, isSignedIn }: LandingActionProps) {
  return (
    <section className="w-full overflow-hidden px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl items-center justify-items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:justify-items-stretch">
        <div className="animate-in w-full max-w-2xl text-center lg:max-w-none lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            <VectorSquareIcon size={16} />
             Beta
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] text-slate-950 sm:text-5xl lg:text-7xl dark:text-white">
            Track you cashflow, Manage you money
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
            NM Finance brings income, cash spending, online payments, and
            monthly statements into one focused dashboard built for daily use.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="landing-auth-button min-h-12 px-5"
            >
              {isSignedIn ? "Open dashboard" : "Start with Google"}
              <ArrowRight size={18} />
            </Link>
            <a
              href="#product"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              View product flow
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className={`grid size-9 place-items-center rounded-full ${metric.bg}`}>
                  <metric.icon className={metric.tone} size={18} />
                </span>
                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {metric.label}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-950 dark:text-white">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-3xl lg:max-w-none">
          <div className="absolute left-4 top-4 z-10 hidden rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200 sm:block">
            + Rs 58,000 income
          </div>
          <ProductDashboard />
        </div>
      </div>
    </section>
  );
}

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-28 border-y border-slate-200 bg-white px-4 py-12 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            Built for daily habits
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-white">
            Small inputs, useful answers.
          </h2>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featureTiles.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className={`grid size-11 place-items-center rounded-full ${feature.bg}`}>
                <feature.icon className={feature.tone} size={21} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductSection() {
  return (
    <section id="product" className="scroll-mt-28 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.82fr]">
        <ProductDashboard />

        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold text-sky-700 dark:text-sky-300">
            Dashboard rhythm
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-white">
            Know the balance, then act.
          </h2>
          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
            The app surfaces balance, payment modes, and recent records first,
            then keeps create and report flows within reach on mobile.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Fast add flow", "Report export", "User scoped data", "Dark mode ready"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReportsSection({ primaryHref, isSignedIn }: LandingActionProps) {
  return (
    <section
      id="reports"
      className="scroll-mt-28 border-y border-slate-200 bg-white px-4 py-12 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_0.55fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-violet-700 dark:text-violet-300">
                Statement Preview
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                Reports that are ready to review.
              </h2>
            </div>
            <FileText className="shrink-0 text-slate-400" size={24} />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-slate-200/70 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Payment</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item) => (
                  <tr
                    key={item.label}
                    className="border-b border-slate-200 dark:border-slate-800"
                  >
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {item.date}
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-950 dark:text-white">
                      {item.label}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {item.mode}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-semibold ${
                        item.amount.startsWith("+")
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="text-emerald-600 dark:text-emerald-300" size={24} />
          <h2 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            Sign in once. Track privately.
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            Your workspace opens through Google and every record is scoped to
            your account.
          </p>
          <Link
            href={primaryHref}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {isSignedIn ? "Go to dashboard" : "Continue with Google"}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingCta({ primaryHref, isSignedIn }: LandingActionProps) {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800 dark:bg-[#f8fafc] dark:text-[#020617] sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-bold text-emerald-300 dark:text-emerald-700">
              Ready when the month starts
            </p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Open the dashboard and start tracking today.
            </h2>
          </div>
          <Link
            href={primaryHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-200 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
          >
            {isSignedIn ? "Open dashboard" : "Start with Google"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter({ primaryHref, isSignedIn }: LandingActionProps) {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1.4fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="grid size-10 place-items-center rounded-full bg-slate-950 text-white dark:bg-[#f8fafc] dark:text-[#020617]">
              <WalletCards size={19} />
            </span>
            <span className="text-slate-950 dark:text-white">NM Finance</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
            A mobile-first personal finance tracker for income, cash expenses,
            online spending, and monthly reports.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Product
            </h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <a href="#features" className="hover:text-slate-950 dark:hover:text-white">
                Features
              </a>
              <a href="#product" className="hover:text-slate-950 dark:hover:text-white">
                Dashboard
              </a>
              <a href="#reports" className="hover:text-slate-950 dark:hover:text-white">
                Reports
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              App
            </h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link href={primaryHref} className="hover:text-slate-950 dark:hover:text-white">
                {isSignedIn ? "Dashboard" : "Sign in"}
              </Link>
              <Link href="/reports" className="hover:text-slate-950 dark:hover:text-white">
                Reports
              </Link>
              <Link href="/expenses/create" className="hover:text-slate-950 dark:hover:text-white">
                Add expense
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Privacy
            </h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>Google sign-in</span>
              <span>User-scoped data</span>
              <span>Private records</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 NM Finance Tracker.</p>
        <p>Built for focused daily money habits.</p>
      </div>
    </footer>
  );
}

function ProductDashboard() {
  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-3 md:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
          <div className="flex items-center justify-between gap-3 md:block">
            <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-emerald-500 text-white">
              <WalletCards size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                NM Finance
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
            </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200 md:hidden">
              Live
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:mt-5 md:block md:space-y-2">
            {["Dashboard", "Income", "Expenses", "Reports"].map((item, index) => (
              <div
                key={item}
                className={`rounded-full px-3 py-2 text-center text-xs font-semibold sm:text-sm md:text-left ${
                  index === 0
                    ? "bg-emerald-500 text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <section className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Current balance
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">
                  Rs 38,750
                </p>
              </div>
              <CalendarDays className="text-emerald-500" size={22} />
            </div>

            <div className="mt-5 flex h-24 items-end gap-2">
              {[40, 68, 48, 82, 58, 92, 72].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t-lg bg-emerald-500/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4"
              >
                <metric.icon className={metric.tone} size={19} />
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {metric.label}
                </p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-950 dark:text-white">
                Recent records
              </p>
              <ReceiptText className="text-slate-400" size={18} />
            </div>
            <div className="mt-3 space-y-2">
              {activity.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.mode} payment
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      item.amount.startsWith("+")
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <TrendingUp size={14} />
        <span>Live preview based on the app dashboard structure</span>
        <LineChart className="sm:ml-auto" size={14} />
      </div>
    </div>
  );
}
