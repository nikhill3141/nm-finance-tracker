import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CirclePlus,
  CreditCard,
  ReceiptText,
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
      icon: TrendingUp,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(analytics.totalExpenses),
      tone: "text-rose-700",
      icon: TrendingDown,
    },
    {
      label: "Cash Expenses",
      value: formatCurrency(analytics.cashExpenses),
      tone: "text-amber-700",
      icon: Banknote,
    },
    {
      label: "Online Expenses",
      value: formatCurrency(analytics.onlineExpenses),
      tone: "text-sky-700",
      icon: CreditCard,
    },
    {
      label: "Max Expense",
      value: analytics.maxExpense
        ? `${analytics.maxExpense.title} - ${formatCurrency(
            Number(analytics.maxExpense.amount),
          )}`
        : "No expenses",
      tone: "text-slate-950",
      icon: ReceiptText,
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
                prefetch
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
          <ThemeToggle className=" hidden md:inline-flex" />
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-300">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-5 sm:p-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-emerald-200">
              <Wallet size={15} />
              Available balance
            </p>
            <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
              {formatCurrency(analytics.balance)}
            </h2>

          </div>

          <div className="border-t border-white/10 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <Banknote size={16} />
                  Cash
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-300">
                  {formatCurrency(analytics.cashExpenses)}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <CreditCard size={16} />
                  Online
                </p>
                <p className="mt-2 text-2xl font-semibold text-sky-300">
                  {formatCurrency(analytics.onlineExpenses)}
                </p>
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
                ? "Expense split for this period"
                : "Add expenses to see your payment split"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`panel p-5 ${
              card.label === "Max Expense" ? "sm:col-span-2 xl:col-span-2" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">{card.label}</p>
              <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700">
                <card.icon size={18} />
              </span>
            </div>
            <p className={`mt-3 text-2xl font-semibold ${card.tone}`}>
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
