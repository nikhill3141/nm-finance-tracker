import Link from "next/link";

import { getIncomes } from "@/lib/incomes";

import { deleteIncomeAction } from "./actions";

export default async function IncomesPage() {
  const incomes = await getIncomes();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Incomes</h1>
          <p className="text-sm text-gray-500">
            Track salary, freelance payments, scholarships, and other sources.
          </p>
        </div>

        <Link
          href="/incomes/create"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Add Income
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id} className="border-t">
                <td className="px-4 py-3">{income.title}</td>
                <td className="px-4 py-3">{income.sourceName}</td>
                <td className="px-4 py-3 capitalize">{income.incomeType}</td>
                <td className="px-4 py-3">₹{income.amount}</td>
                <td className="px-4 py-3">
                  {income.transactionDate.toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/incomes/${income.id}`}
                      className="rounded-md border px-3 py-1 text-xs"
                    >
                      View
                    </Link>
                    <Link
                      href={`/incomes/${income.id}/edit`}
                      className="rounded-md border px-3 py-1 text-xs"
                    >
                      Edit
                    </Link>
                    <form action={deleteIncomeAction.bind(null, income.id)}>
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

            {incomes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No incomes added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
