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

export async function getDashboardAnalytics(
  period: PeriodFilter = "this-month",
) {
  const [incomes, expenses] = await Promise.all([getIncomes(), getExpenses()]);
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

  return {
    period,
    totalIncome,
    totalExpenses,
    balance,
    maxExpense,
    topCategory: topCategory
      ? {
          category: topCategory[0],
          amount: topCategory[1],
        }
      : null,
    incomeCount: filteredIncomes.length,
    expenseCount: filteredExpenses.length,
  };
}
