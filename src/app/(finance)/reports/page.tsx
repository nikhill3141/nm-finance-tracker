import { CalendarDays, FileText, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

import { requireUserId } from "@/lib/auth-session";
import { normalizePeriod } from "@/lib/date-filters";
import { formatCurrency } from "@/lib/format";
import { getMonthlyReport } from "@/lib/reports";

import { ReportExportActions } from "./report-export-actions";

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

const periodLabels = {
  "this-month": "This Month",
  "last-month": "Last Month",
  all: "All Time",
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const period = normalizePeriod(params.period);
  const report = await getMonthlyReport(userId, period);
  const generatedAt = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const expenseRows = report.sortedExpenses.map((expense) => ({
    title: expense.title,
    detail: expense.category,
    amount: Number(expense.amount),
    date: expense.transactionDate.toLocaleDateString("en-IN"),
  }));

  const incomeRows = report.sortedIncomes.map((income) => ({
    title: income.title,
    detail: income.sourceName,
    amount: Number(income.amount),
    date: income.transactionDate.toLocaleDateString("en-IN"),
  }));

  return (
    <section className="animate-in space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <FileText size={15} />
            Statement report
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Monthly Report
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            A document-style summary of income, expenses, balance, and largest
            transactions.
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

      <div className="rounded-lg bg-slate-950 p-2 shadow-2xl shadow-slate-300">
        <article className="rounded-lg bg-[#fffdf7] p-5 text-slate-950 sm:p-8 lg:p-10">
          <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                NM Finance Tracker
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                {periodLabels[report.period]} Statement
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={16} />
                Generated on {generatedAt}
              </p>
            </div>

            <ReportExportActions
              periodLabel={periodLabels[report.period]}
              generatedAt={generatedAt}
              summary={{
                totalIncome: report.totalIncome,
                totalExpenses: report.totalExpenses,
                balance: report.balance,
              }}
              incomes={incomeRows}
              expenses={expenseRows}
            />
          </header>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-800">
                  Total Income
                </p>
                <TrendingUp className="text-emerald-700" size={20} />
              </div>
              <p className="mt-4 text-3xl font-semibold text-emerald-800">
                {formatCurrency(report.totalIncome)}
              </p>
            </div>

            <div className="rounded-lg bg-rose-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-rose-800">
                  Total Expenses
                </p>
                <TrendingDown className="text-rose-700" size={20} />
              </div>
              <p className="mt-4 text-3xl font-semibold text-rose-800">
                {formatCurrency(report.totalExpenses)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 p-5">
              <p className="text-sm font-semibold text-slate-600">Balance</p>
              <p className="mt-4 text-3xl font-semibold">
                {formatCurrency(report.balance)}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <ReportList
              title="Expenses by amount"
              empty="No expenses found."
              rows={expenseRows}
              tone="expense"
            />
            <ReportList
              title="Incomes by amount"
              empty="No incomes found."
              rows={incomeRows}
              tone="income"
            />
          </div>
        </article>
      </div>
    </section>
  );
}

function ReportList({
  title,
  empty,
  rows,
  tone,
}: {
  title: string;
  empty: string;
  rows: {
    title: string;
    detail: string;
    amount: number;
    date: string;
  }[];
  tone: "income" | "expense";
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {rows.length} rows
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={`${row.title}-${row.date}-${row.amount}`}
            className="flex items-center justify-between gap-4 py-4 text-sm"
          >
            <div>
              <p className="font-semibold">{row.title}</p>
              <p className="mt-1 text-slate-500 capitalize">
                {row.detail} - {row.date}
              </p>
            </div>
            <p
              className={`font-semibold ${
                tone === "income" ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {formatCurrency(row.amount)}
            </p>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="py-5 text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </section>
  );
}
