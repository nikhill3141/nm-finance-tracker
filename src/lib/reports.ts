import { getExpenses } from "./expenses";
import { getIncomes } from "./incomes";

function toNumber(value: string | null | undefined) {
  return Number(value ?? 0);
}

export async function getMonthlyReport() {
  const [incomes, expenses] = await Promise.all([getIncomes(), getExpenses()]);

  const totalIncome = incomes.reduce(
    (sum, income) => sum + toNumber(income.amount),
    0,
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + toNumber(expense.amount),
    0,
  );

  const sortedExpenses = [...expenses].sort(
    (a, b) => toNumber(b.amount) - toNumber(a.amount),
  );

  const sortedIncomes = [...incomes].sort(
    (a, b) => toNumber(b.amount) - toNumber(a.amount),
  );

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    sortedExpenses,
    sortedIncomes,
  };
}
