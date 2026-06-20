import { Trash2 } from "lucide-react";
import Link from "next/link";

import { requireUserId } from "@/lib/auth-session";
import { formatCurrency } from "@/lib/format";
import { getIncomes } from "@/lib/incomes";

import { deleteIncomeAction } from "./actions";

export default async function IncomesPage() {
  const userId = await requireUserId();
  const incomes = await getIncomes(userId);

  return (
    <section className="animate-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Incomes</h1>
          <p className="mt-1 max-w-lg text-sm text-slate-500">
            Track salary, freelance payments, scholarships, and other sources.
          </p>
        </div>

        <Link href="/incomes/create" className="button-primary shrink-0">
          Add Income
        </Link>
      </div>

      <div className="grid gap-3 md:hidden">
        {incomes.map((income) => (
          <article key={income.id} className="panel p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{income.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {income.sourceName} - {income.incomeType}
                </p>
              </div>
              <p className="font-semibold text-emerald-700">
                {formatCurrency(income.amount)}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-slate-500">
                {income.transactionDate.toLocaleDateString("en-IN")}
              </span>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                <Link href={`/incomes/${income.id}`} className="button-soft">
                  View
                </Link>
                <Link
                  href={`/incomes/${income.id}/edit`}
                  className="button-soft"
                >
                  Edit
                </Link>
                <form action={deleteIncomeAction.bind(null, income.id)}>
                  <button
                    type="submit"
                    className="button-soft text-red-600"
                    aria-label={`Delete ${income.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}

        {incomes.length === 0 && (
          <div className="empty-state">
            <p className="font-medium">No income yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first income source to start seeing reports.
            </p>
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
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
              <tr key={income.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{income.title}</td>
                <td className="px-4 py-3">{income.sourceName}</td>
                <td className="px-4 py-3 capitalize">{income.incomeType}</td>
                <td className="px-4 py-3 font-medium text-emerald-700">
                  {formatCurrency(income.amount)}
                </td>
                <td className="px-4 py-3">
                  {income.transactionDate.toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/incomes/${income.id}`} className="button-soft">
                      View
                    </Link>
                    <Link
                      href={`/incomes/${income.id}/edit`}
                      className="button-soft"
                    >
                      Edit
                    </Link>
                    <form action={deleteIncomeAction.bind(null, income.id)}>
                      <button type="submit" className="button-soft text-red-600">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {incomes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500"
                >
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
