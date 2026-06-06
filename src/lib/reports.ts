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

export async function getMonthlyReport(period: PeriodFilter = "this-month") {
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

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => toNumber(b.amount) - toNumber(a.amount),
  );

  const sortedIncomes = [...filteredIncomes].sort(
    (a, b) => toNumber(b.amount) - toNumber(a.amount),
  );

  return {
    period,
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    sortedExpenses,
    sortedIncomes,
  };
}
