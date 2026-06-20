import {
  Banknote,
  BarChart3,
  CreditCard,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { requireUserId } from "@/lib/auth-session";
import { getDashboardAnalytics } from "@/lib/analytics";
import { normalizePeriod } from "@/lib/date-filters";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

type AnalyticsPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const periodLinks = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "All Time", value: "all" },
];

function OnlineBadges() {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-200">
        <span className="grid size-5 place-items-center rounded-full bg-white text-[0.62rem] font-black text-sky-700">
          G
        </span>
        GPay
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-200">
        <span className="grid size-5 place-items-center rounded-full bg-violet-500 text-[0.58rem] font-black text-white">
          Pe
        </span>
        PhonePe
      </span>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const analytics = await getDashboardAnalytics(userId, period);
  const trendBars = analytics.expenseTrend;
  const categoryBars = analytics.categoryBreakdown;
  const paymentMix = [
    {
      label: "Cash",
      value: analytics.cashExpenses,
      percentage:
        analytics.totalExpenses > 0
          ? (analytics.cashExpenses / analytics.totalExpenses) * 100
          : 0,
      icon: Banknote,
      color: "bg-amber-400",
      tone: "text-amber-700",
    },
    {
      label: "Online",
      value: analytics.onlineExpenses,
      percentage:
        analytics.totalExpenses > 0
          ? (analytics.onlineExpenses / analytics.totalExpenses) * 100
          : 0,
      icon: CreditCard,
      color: "bg-sky-400",
      tone: "text-sky-700",
    },
  ];

  return (
    <section className="animate-in space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
            <BarChart3 size={15} />
            Graph analytics
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Analytics</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Visual breakdown of spending, categories, and payment behavior.
          </p>
        </div>

        <div className="flex overflow-x-auto rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {periodLinks.map((link) => (
            <Link
              key={link.value}
              href={`/analytics?period=${link.value}`}
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
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <TrendingUp size={16} />
            Income
          </p>
          <p className="mt-3 text-2xl font-semibold text-emerald-700">
            {formatCurrency(analytics.totalIncome)}
          </p>
        </div>
        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <TrendingDown size={16} />
            Expenses
          </p>
          <p className="mt-3 text-2xl font-semibold text-rose-700">
            {formatCurrency(analytics.totalExpenses)}
          </p>
        </div>
        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <PieChart size={16} />
            Top Category
          </p>
          <p className="mt-3 text-2xl font-semibold capitalize">
            {analytics.topCategory?.category ?? "No expenses"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Expense Trend</h2>
              <p className="text-sm text-slate-500">Daily spend movement</p>
            </div>
          </div>

          <div className="mt-6 flex h-72 items-end gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            {trendBars.length > 0 ? (
              trendBars.map((item) => (
                <div
                  key={item.date}
                  className="flex h-full min-w-12 flex-1 flex-col justify-end gap-2"
                >
                  <p className="text-center text-[0.68rem] font-semibold text-slate-500">
                    {formatCurrency(item.amount)}
                  </p>
                  <div className="flex flex-1 items-end">
                    <span
                      className="w-full rounded-t-lg bg-rose-500"
                      style={{ height: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                  <p className="truncate text-center text-[0.7rem] font-semibold text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))
            ) : (
              <div className="grid h-full min-w-full place-items-center text-center text-sm text-slate-500">
                Add expenses to generate the trend graph.
              </div>
            )}
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-xl font-semibold">Payment Mix</h2>
          <p className="text-sm text-slate-500">Cash vs online split</p>

          <div className="mt-6 space-y-4">
            {paymentMix.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <item.icon size={16} />
                    {item.label}
                  </p>
                  <p className={`font-semibold ${item.tone}`}>
                    {formatCurrency(item.value)}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <span
                    className={`block h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                {item.label === "Online" ? <OnlineBadges /> : null}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Category Breakdown</h2>
            <p className="text-sm text-slate-500">Where expenses are going</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {categoryBars.length > 0 ? (
            categoryBars.map((category) => (
              <div
                key={category.category}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold capitalize">{category.category}</p>
                  <p className="font-semibold text-rose-700">
                    {formatCurrency(category.amount)}
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                  <span
                    className="block h-full rounded-full bg-emerald-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 md:col-span-2">
              No category data yet.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
