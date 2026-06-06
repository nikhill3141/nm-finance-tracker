import Link from "next/link";

import { requireUserId } from "@/lib/auth-session";
import { getDashboardAnalytics } from "@/lib/analytics";
import { normalizePeriod } from "@/lib/date-filters";
import { formatCurrency } from "@/lib/format";

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

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const analytics = await getDashboardAnalytics(userId, period);

  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(analytics.totalIncome),
      tone: "text-emerald-700",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(analytics.totalExpenses),
      tone: "text-rose-700",
    },
    {
      label: "Balance",
      value: formatCurrency(analytics.balance),
      tone: analytics.balance >= 0 ? "text-slate-950" : "text-rose-700",
    },
    {
      label: "Max Expense",
      value: analytics.maxExpense
        ? `${analytics.maxExpense.title} - ${formatCurrency(
            Number(analytics.maxExpense.amount),
          )}`
        : "No expenses",
      tone: "text-slate-950",
    },
  ];

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
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            A quick view of your money flow, balance, and spending focus.
          </p>
        </div>

        <div className="flex overflow-x-auto rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {periodLinks.map((link) => (
            <Link
              key={link.value}
              href={`/dashboard?period=${link.value}`}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="panel p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p
              className={`mt-2 text-2xl font-semibold tracking-tight ${card.tone}`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-semibold">Top Spending Category</h2>
          <p className="mt-3 text-2xl font-semibold capitalize">
            {analytics.topCategory
              ? analytics.topCategory.category
              : "No expenses"}
          </p>
          <p className="text-sm text-slate-500">
            {analytics.topCategory
              ? formatCurrency(analytics.topCategory.amount)
              : "Add expenses to see category insights."}
          </p>
        </div>

        <div className="panel p-5">
          <h2 className="font-semibold">Records</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-slate-500">Income Records</p>
              <p className="text-2xl font-semibold">{analytics.incomeCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Expense Records</p>
              <p className="text-2xl font-semibold">{analytics.expenseCount}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
