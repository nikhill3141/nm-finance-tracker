import { CalendarDays, FileText } from "lucide-react";
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

  const statementRows = [
    ...report.sortedExpenses.map((expense) => ({
      id: expense.id,
      type: "Expense" as const,
      title: expense.title,
      categoryOrSource: expense.category,
      paymentMode: expense.paymentMode,
      amount: Number(expense.amount),
      date: expense.transactionDate,
    })),
    ...report.sortedIncomes.map((income) => ({
      id: income.id,
      type: "Income" as const,
      title: income.title,
      categoryOrSource: income.sourceName,
      paymentMode: "Account",
      amount: Number(income.amount),
      date: income.transactionDate,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const exportRows = statementRows.map((row) => ({
    type: row.type,
    title: row.title,
    categoryOrSource: row.categoryOrSource,
    paymentMode: row.paymentMode,
    amount: row.amount,
    signedAmount: row.type === "Income" ? row.amount : -row.amount,
    date: row.date.toLocaleDateString("en-IN"),
  }));

  const summaryCards = [
    {
      label: "Total Income",
      value: formatCurrency(report.totalIncome),
      tone: "text-emerald-700",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(report.totalExpenses),
      tone: "text-rose-700",
    },
    {
      label: "Closing Balance",
      value: formatCurrency(report.balance),
      tone: report.balance >= 0 ? "text-slate-950" : "text-rose-700",
    },
  ];

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
            A clean table of cash flow activity for the selected period.
          </p>
        </div>

        <div className="flex overflow-x-auto rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {periodLinks.map((link) => (
            <Link
              key={link.value}
              href={`/reports?period=${link.value}`}
              prefetch
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

      <div className="overflow-hidden rounded-lg bg-slate-950 p-2 shadow-2xl shadow-slate-300">
        <article className="rounded-lg bg-[#fffdf7] p-4 text-slate-950 sm:p-8 lg:p-10">
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
              rows={exportRows}
            />
          </header>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <p className={`mt-2 text-xl font-semibold ${card.tone}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {statementRows.map((row) => (
              <article
                key={`${row.type}-${row.id}`}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      {row.date.toLocaleDateString("en-IN")}
                    </p>
                    <h3 className="mt-1 truncate text-base font-semibold">
                      {row.title}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      row.type === "Income"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {row.type}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">
                      {row.type === "Income" ? "Source" : "Category"}
                    </p>
                    <p className="mt-1 truncate font-medium capitalize">
                      {row.categoryOrSource}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Payment</p>
                    <p className="mt-1 truncate font-medium capitalize">
                      {row.paymentMode}
                    </p>
                  </div>
                </div>

                <p
                  className={`mt-4 text-right text-xl font-semibold ${
                    row.type === "Income" ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {row.type === "Income" ? "+" : "-"}
                  {formatCurrency(row.amount)}
                </p>
              </article>
            ))}

            {statementRows.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                No transactions found for this period.
              </div>
            )}
          </div>

          <div className="mt-8 hidden overflow-x-auto rounded-lg border border-slate-300 bg-white md:block">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="border-b border-slate-300 px-4 py-3">Date</th>
                  <th className="border-b border-slate-300 px-4 py-3">Type</th>
                  <th className="border-b border-slate-300 px-4 py-3">
                    Description
                  </th>
                  <th className="border-b border-slate-300 px-4 py-3">
                    Source or Category
                  </th>
                  <th className="border-b border-slate-300 px-4 py-3">
                    Payment
                  </th>
                  <th className="border-b border-slate-300 px-4 py-3 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {statementRows.map((row) => (
                  <tr
                    key={`${row.type}-${row.id}`}
                    className="border-b border-slate-200"
                  >
                    <td className="px-4 py-3">
                      {row.date.toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          row.type === "Income"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{row.title}</td>
                    <td className="px-4 py-3 capitalize">
                      {row.categoryOrSource}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {row.paymentMode}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        row.type === "Income"
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {row.type === "Income" ? "+" : "-"}
                      {formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))}

                {statementRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No transactions found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-[#efefef] font-semibold">
                <tr>
                  <td
                    colSpan={5}
                    className="border-t border-slate-300 px-4 py-3"
                  >
                    Total Income
                  </td>
                  <td className="border-t border-slate-300 px-4 py-3 text-right text-emerald-700">
                    {formatCurrency(report.totalIncome)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="px-4 py-3">
                    Total Expenses
                  </td>
                  <td className="px-4 py-3 text-right text-rose-700">
                    {formatCurrency(report.totalExpenses)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="px-4 py-3">
                    Closing Balance
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      report.balance >= 0 ? "text-slate-950" : "text-rose-700"
                    }`}
                  >
                    {formatCurrency(report.balance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
