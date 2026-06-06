import { getMonthlyReport } from "@/lib/reports";

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export default async function ReportsPage() {
  const report = await getMonthlyReport();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Monthly Report</h1>
        <p className="text-sm text-gray-500">
          Review income, expenses, balance, and largest spending entries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="mt-2 text-xl font-semibold">
            {formatCurrency(report.totalIncome)}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="mt-2 text-xl font-semibold">
            {formatCurrency(report.totalExpenses)}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="mt-2 text-xl font-semibold">
            {formatCurrency(report.balance)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h2 className="font-semibold">Expenses by Amount</h2>
          </div>
          <div className="divide-y">
            {report.sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{expense.title}</p>
                  <p className="text-gray-500 capitalize">
                    {expense.category} •{" "}
                    {expense.transactionDate.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            ))}

            {report.sortedExpenses.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No expenses found.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h2 className="font-semibold">Incomes by Amount</h2>
          </div>
          <div className="divide-y">
            {report.sortedIncomes.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{income.title}</p>
                  <p className="text-gray-500">
                    {income.sourceName} •{" "}
                    {income.transactionDate.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(income.amount)}</p>
              </div>
            ))}

            {report.sortedIncomes.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No incomes found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
