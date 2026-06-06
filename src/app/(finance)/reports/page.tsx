import Link from "next/link";

import { requireUserId } from "@/lib/auth-session";
import { normalizePeriod } from "@/lib/date-filters";
import { formatCurrency } from "@/lib/format";
import { getMonthlyReport } from "@/lib/reports";

type ReportsPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const periodLinks = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "All Time", value: "all" },
];

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const report = await getMonthlyReport(userId, period);

  return (
    <section className="animate-in space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Monthly Report
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Review income, expenses, balance, and largest spending entries.
          </p>
        </div>

        <div className="flex overflow-x-auto rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {periodLinks.map((link) => (
            <Link
              key={link.value}
              href={`/reports?period=${link.value}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                report.period === link.value
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
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {formatCurrency(report.totalIncome)}
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="mt-2 text-2xl font-semibold text-rose-700">
            {formatCurrency(report.totalExpenses)}
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-sm text-slate-500">Balance</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(report.balance)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold">Expenses by Amount</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {report.sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between gap-4 p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{expense.title}</p>
                  <p className="text-slate-500 capitalize">
                    {expense.category} -{" "}
                    {expense.transactionDate.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="font-semibold text-rose-700">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            ))}

            {report.sortedExpenses.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No expenses found.</p>
            )}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold">Incomes by Amount</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {report.sortedIncomes.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between gap-4 p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{income.title}</p>
                  <p className="text-slate-500">
                    {income.sourceName} -{" "}
                    {income.transactionDate.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="font-semibold text-emerald-700">
                  {formatCurrency(income.amount)}
                </p>
              </div>
            ))}

            {report.sortedIncomes.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No incomes found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
