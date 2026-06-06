import Link from "next/link";

import { getExpenses } from "@/lib/expenses";

import { deleteExpenseAction } from "./actions";

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-gray-500">
            Track spending across food, travel, rent, education, and more.
          </p>
        </div>

        <Link
          href="/expenses/create"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Add Expense
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t">
                <td className="px-4 py-3">{expense.title}</td>
                <td className="px-4 py-3 capitalize">{expense.category}</td>
                <td className="px-4 py-3">₹{expense.amount}</td>
                <td className="px-4 py-3">
                  {expense.transactionDate.toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/expenses/${expense.id}`}
                      className="rounded-md border px-3 py-1 text-xs"
                    >
                      View
                    </Link>
                    <Link
                      href={`/expenses/${expense.id}/edit`}
                      className="rounded-md border px-3 py-1 text-xs"
                    >
                      Edit
                    </Link>
                    <form action={deleteExpenseAction.bind(null, expense.id)}>
                      <button
                        type="submit"
                        className="rounded-md border px-3 py-1 text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No expenses added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
