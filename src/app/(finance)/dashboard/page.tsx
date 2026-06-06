import Link from "next/link";

import { getDashboardAnalytics } from "@/lib/analytics";
import { normalizePeriod } from "@/lib/date-filters";

type DashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

const periodLinks = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "All Time", value: "all" },
];

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const analytics = await getDashboardAnalytics(period);

  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(analytics.totalIncome),
    },
    {
      label: "Total Expenses",
      value: formatCurrency(analytics.totalExpenses),
    },
    {
      label: "Balance",
      value: formatCurrency(analytics.balance),
    },
    {
      label: "Max Expense",
      value: analytics.maxExpense
        ? `${analytics.maxExpense.title} - ${formatCurrency(
            Number(analytics.maxExpense.amount),
          )}`
        : "No expenses",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Your finance summary across income, expenses, and spending patterns.
          </p>
        </div>

        <div className="flex gap-2">
          {periodLinks.map((link) => (
            <Link
              key={link.value}
              href={`/dashboard?period=${link.value}`}
              className={`rounded-md border px-3 py-2 text-sm ${
                analytics.period === link.value
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold">Top Spending Category</h2>
          <p className="mt-3 text-2xl font-semibold capitalize">
            {analytics.topCategory
              ? analytics.topCategory.category
              : "No expenses"}
          </p>
          <p className="text-sm text-gray-500">
            {analytics.topCategory
              ? formatCurrency(analytics.topCategory.amount)
              : "Add expenses to see category insights."}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <h2 className="font-semibold">Records</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Income Records</p>
              <p className="text-2xl font-semibold">{analytics.incomeCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expense Records</p>
              <p className="text-2xl font-semibold">{analytics.expenseCount}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
