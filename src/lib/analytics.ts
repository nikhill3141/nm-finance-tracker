import { getExpenses } from "./expenses";
import { getIncomes } from "./incomes";

function toNumber(value: string | null | undefined) {
  return Number(value ?? 0);
}

export async function getDashboardAnalytics() {
  const [incomes, expenses] = await Promise.all([getIncomes(), getExpenses()]);

  const totalIncome = incomes.reduce(
    (sum, income) => sum + toNumber(income.amount),
    0,
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + toNumber(expense.amount),
    0,
  );

  const balance = totalIncome - totalExpenses;

  const maxExpense = expenses.reduce(
    (max, expense) =>
      toNumber(expense.amount) > toNumber(max?.amount) ? expense : max,
    expenses[0],
  );

  const categoryTotals = expenses.reduce<Record<string, number>>(
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
    incomeCount: incomes.length,
    expenseCount: expenses.length,
  };
}
