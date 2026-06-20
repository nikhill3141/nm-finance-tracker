import {
  getDateRange,
  isWithinDateRange,
  type PeriodFilter,
} from "./date-filters";
import { getExpenses } from "./expenses";
import { getIncomes } from "./incomes";

function toNumber(value: string | null | undefined) {
  return Number(value ?? 0);
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export async function getDashboardAnalytics(
  userId: string,
  period: PeriodFilter = "this-month",
) {
  const [incomes, expenses] = await Promise.all([
    getIncomes(userId),
    getExpenses(userId),
  ]);
  const range = getDateRange(period);

  const filteredIncomes = incomes.filter((income) =>
    isWithinDateRange(income.transactionDate, range),
  );

  const filteredExpenses = expenses.filter((expense) =>
    isWithinDateRange(expense.transactionDate, range),
  );

  const totalIncome = filteredIncomes.reduce(
    (sum, income) => sum + toNumber(income.amount),
    0,
  );

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + toNumber(expense.amount),
    0,
  );

  const cashExpenses = filteredExpenses
    .filter((expense) => expense.paymentMode === "cash")
    .reduce((sum, expense) => sum + toNumber(expense.amount), 0);

  const onlineExpenses = filteredExpenses
    .filter((expense) => expense.paymentMode === "online")
    .reduce((sum, expense) => sum + toNumber(expense.amount), 0);

  const balance = totalIncome - totalExpenses;

  const maxExpense = filteredExpenses.reduce(
    (max, expense) =>
      toNumber(expense.amount) > toNumber(max?.amount) ? expense : max,
    filteredExpenses[0],
  );

  const categoryTotals = filteredExpenses.reduce<Record<string, number>>(
    (totals, expense) => {
      totals[expense.category] =
        (totals[expense.category] ?? 0) + toNumber(expense.amount);

      return totals;
    },
    {},
  );

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const dailyExpenseTotals = filteredExpenses.reduce<Record<string, number>>(
    (totals, expense) => {
      const key = getDateKey(expense.transactionDate);
      totals[key] = (totals[key] ?? 0) + toNumber(expense.amount);

      return totals;
    },
    {},
  );

  const maxDailyExpense = Math.max(...Object.values(dailyExpenseTotals), 0);
  const expenseTrend = Object.entries(dailyExpenseTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      date,
      label: getDateLabel(date),
      amount,
      percentage: maxDailyExpense > 0 ? (amount / maxDailyExpense) * 100 : 0,
    }));

  return {
    period,
    totalIncome,
    totalExpenses,
    cashExpenses,
    onlineExpenses,
    balance,
    maxExpense,
    topCategory: topCategory
      ? {
          category: topCategory[0],
          amount: topCategory[1],
        }
      : null,
    categoryBreakdown,
    expenseTrend,
    incomeCount: filteredIncomes.length,
    expenseCount: filteredExpenses.length,
  };
}
