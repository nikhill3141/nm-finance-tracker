import {
  Activity,
  Banknote,
  BarChart3,
  CalendarDays,
  CreditCard,
  PieChart,
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

const categoryPalette = [
  "#10b981",
  "#f43f5e",
  "#0ea5e9",
  "#f59e0b",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#64748b",
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
  const topCategory = categoryBars[0] ?? null;
  const highestDay = trendBars.reduce<(typeof trendBars)[number] | null>(
    (highest, item) => (!highest || item.amount > highest.amount ? item : highest),
    null,
  );
  const categorySegments = categoryBars.reduce<
    Array<
      (typeof categoryBars)[number] & {
        color: string;
        start: number;
        end: number;
      }
    >
  >((segments, category, index) => {
    const start = segments[index - 1]?.end ?? 0;
    const end = start + category.percentage;

    return [
      ...segments,
      {
        ...category,
        color: categoryPalette[index % categoryPalette.length],
        start,
        end,
      },
    ];
  }, []);
  const categoryGradient =
    categorySegments.length > 0
      ? `conic-gradient(${categorySegments
          .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
          .join(", ")})`
      : "conic-gradient(#e2e8f0 0% 100%)";
  const remainingCategoryShare = Math.max(0, 100 - (topCategory?.percentage ?? 0));
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
  const dominantPayment = paymentMix.reduce((highest, item) =>
    item.value > highest.value ? item : highest,
  );

  return (
    <section className="animate-in space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
            <BarChart3 size={15} />
            Analytics
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

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Activity size={16} />
            Spending concentration
          </p>
          <div className="mt-5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="flex h-4">
              <span
                className="bg-emerald-500"
                style={{ width: `${topCategory?.percentage ?? 0}%` }}
              />
              <span
                className="bg-slate-300 dark:bg-slate-600"
                style={{ width: `${remainingCategoryShare}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span className="capitalize text-slate-500">
              {topCategory?.category ?? "No category"}
            </span>
            <span className="font-semibold text-slate-950">
              {topCategory ? `${topCategory.percentage.toFixed(1)}%` : "0%"}
            </span>
          </div>
        </div>

        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <CalendarDays size={16} />
            Peak spending day
          </p>
          <div className="mt-5 flex h-20 items-end gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            {trendBars.slice(-5).map((item) => (
              <div key={item.date} className="flex h-full flex-1 items-end">
                <span
                  className={`w-full rounded-t-md ${
                    item.date === highestDay?.date
                      ? "bg-rose-500"
                      : "bg-rose-200 dark:bg-rose-900"
                  }`}
                  style={{ height: `${Math.max(item.percentage, 10)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-500">
              {highestDay?.label ?? "No activity"}
            </span>
            <span className="font-semibold text-rose-700">
              {highestDay ? formatCurrency(highestDay.amount) : formatCurrency(0)}
            </span>
          </div>
        </div>

        <div className="panel p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <CreditCard size={16} />
            Payment behavior
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {paymentMix.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className={`text-lg font-semibold ${item.tone}`}>
                  {item.percentage.toFixed(0)}%
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {dominantPayment.label} leads this period.
          </p>
        </div>
      </section>

      <section className="panel overflow-hidden p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
              <PieChart size={16} />
              Category-wise spending
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              Spending Distribution
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              A category graph showing which areas are taking the largest share
              of expenses.
            </p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {categorySegments.length} categories
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative mx-auto grid aspect-square w-full max-w-[18rem] place-items-center rounded-full p-4 shadow-inner shadow-slate-300/40 dark:shadow-black/30">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: categoryGradient }}
            />
            <div className="relative grid size-[58%] place-items-center rounded-full border border-slate-200 bg-white text-center shadow-lg shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Total spent
                </p>
                <p className="mt-1 text-lg font-semibold text-rose-700">
                  {formatCurrency(analytics.totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {categorySegments.length > 0 ? (
              categorySegments.map((category) => (
                <div
                  key={category.category}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold capitalize">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: category.color }}
                        />
                        <span className="truncate">{category.category}</span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {category.percentage.toFixed(1)}% of spending
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-rose-700">
                      {formatCurrency(category.amount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 sm:col-span-2">
                No category data yet.
              </div>
            )}
          </div>
        </div>
      </section>

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
          {categorySegments.length > 0 ? (
            categorySegments.map((category) => (
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
                    className="block h-full rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      background: category.color,
                    }}
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
