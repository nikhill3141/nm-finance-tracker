import {
  ArrowDownLeft,
  Banknote,
  BarChart3,
  ChevronRight,
  PieChart,
  ReceiptText,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { requireUserId } from "@/lib/auth-session";
import { getDashboardAnalytics } from "@/lib/analytics";
import { normalizePeriod } from "@/lib/date-filters";
import { formatCurrency } from "@/lib/format";

import { ThemeToggle } from "./theme-toggle";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const periodLinks = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "All Time", value: "all" },
];

function OnlinePaymentBadges() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-bold text-sky-100 ring-1 ring-white/10">
        <span className="grid size-5 place-items-center rounded-full bg-white text-[0.62rem] font-black text-sky-700">
          G
        </span>
        GPay
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-bold text-violet-100 ring-1 ring-white/10">
        <span className="grid size-5 place-items-center rounded-full bg-violet-500 text-[0.58rem] font-black text-white">
          Pe
        </span>
        PhonePe
      </span>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const analytics = await getDashboardAnalytics(userId, period);
  const trendBars = analytics.expenseTrend.slice(-7);
  const categoryBars = analytics.categoryBreakdown.slice(0, 4);

  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(analytics.totalIncome),
      helper: `${analytics.incomeCount} income records`,
      tone: "text-emerald-700",
      icon: TrendingUp,
      href: "/incomes",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(analytics.totalExpenses),
      helper: `${analytics.expenseCount} expense records`,
      tone: "text-rose-700",
      icon: TrendingDown,
      href: "/expenses",
    },
    {
      label: "Max Expense",
      value: analytics.maxExpense
        ? formatCurrency(Number(analytics.maxExpense.amount))
        : "No expenses",
      helper: analytics.maxExpense?.title ?? "Add expenses to compare",
      tone: "text-slate-950",
      icon: ReceiptText,
      href: "/expenses",
    },
  ];

  const expenseSplit =
    analytics.totalExpenses > 0
      ? {
          cash: (analytics.cashExpenses / analytics.totalExpenses) * 100,
          online: (analytics.onlineExpenses / analytics.totalExpenses) * 100,
        }
      : { cash: 0, online: 0 };

  return (
    <section className="animate-in space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex overflow-x-auto rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {periodLinks.map((link) => (
              <Link
                key={link.value}
                href={`/dashboard?period=${link.value}`}
                prefetch={false}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  analytics.period === link.value
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-300 dark:border-slate-800 dark:shadow-black/30">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center p-5 sm:p-7">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-emerald-200">
                <Wallet size={15} />
                Available balance
              </p>
              <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
                {formatCurrency(analytics.balance)}
              </h2>
            </div>
          </div>

          <div className="border-t border-white/10 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <Banknote size={16} />
                  Cash
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-300">
                  {formatCurrency(analytics.cashExpenses)}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <Smartphone size={16} />
                  Online
                </p>
                <p className="mt-2 text-2xl font-semibold text-sky-300">
                  {formatCurrency(analytics.onlineExpenses)}
                </p>
                <OnlinePaymentBadges />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-full bg-white/10">
              <div className="flex h-3">
                <span
                  className="bg-amber-400"
                  style={{ width: `${expenseSplit.cash}%` }}
                />
                <span
                  className="bg-sky-400"
                  style={{ width: `${expenseSplit.online}%` }}
                />
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <ArrowDownLeft size={16} />
              {analytics.totalExpenses > 0
                ? "Cash and online split for this period"
                : "Add expenses to see your payment split"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="panel group p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className={`mt-3 text-2xl font-semibold ${card.tone}`}>
                  {card.value}
                </p>
              </div>
              <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
                <card.icon size={18} />
              </span>
            </div>
            <p className="mt-4 flex items-center justify-between gap-2 text-sm text-slate-500">
              <span className="truncate">{card.helper}</span>
              <ChevronRight size={16} className="shrink-0" />
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Link href="/analytics" className="panel group p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                <BarChart3 size={16} />
                Expense graph
              </p>
              <h2 className="mt-2 text-xl font-semibold">Spending pulse</h2>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
              View analytics
              <ChevronRight size={16} />
            </span>
          </div>

          <div className="mt-6 flex h-48 items-end gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            {trendBars.length > 0 ? (
              trendBars.map((item) => (
                <div
                  key={item.date}
                  className="flex h-full flex-1 flex-col justify-end gap-2"
                >
                  <div className="flex flex-1 items-end">
                    <span
                      className="w-full rounded-t-lg bg-rose-500/85 transition group-hover:bg-rose-500"
                      style={{ height: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                  <p className="truncate text-center text-[0.68rem] font-semibold text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))
            ) : (
              <div className="grid h-full w-full place-items-center text-center text-sm text-slate-500">
                Add expenses to build your graph.
              </div>
            )}
          </div>
        </Link>

        <Link href="/expenses" className="panel p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <PieChart size={16} />
            Top category
          </p>
          <h2 className="mt-3 text-2xl font-semibold capitalize">
            {analytics.topCategory
              ? analytics.topCategory.category
              : "No expenses"}
          </h2>
          <p className="text-sm text-slate-500">
            {analytics.topCategory
              ? formatCurrency(analytics.topCategory.amount)
              : "Add expenses to see category insights."}
          </p>

          <div className="mt-5 space-y-3">
            {categoryBars.map((category) => (
              <div key={category.category}>
                <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold capitalize text-slate-500">
                  <span>{category.category}</span>
                  <span>{formatCurrency(category.amount)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <span
                    className="block h-full rounded-full bg-emerald-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
