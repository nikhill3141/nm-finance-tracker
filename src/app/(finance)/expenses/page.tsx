import { Banknote, CreditCard, Trash2 } from "lucide-react";
import Link from "next/link";

import { requireUserId } from "@/lib/auth-session";
import { getExpenses } from "@/lib/expenses";
import { formatCurrency } from "@/lib/format";

import { deleteExpenseAction } from "./actions";

function PaymentModeBadge({ mode }: { mode: "cash" | "online" }) {
  const Icon = mode === "cash" ? Banknote : CreditCard;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">
      <Icon size={14} />
      {mode}
    </span>
  );
}

export default async function ExpensesPage() {
  const userId = await requireUserId();
  const expenses = await getExpenses(userId);

  return (
    <section className="animate-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Expenses</h1>
          <p className="mt-1 max-w-lg text-sm text-slate-500">
            Track spending across food, travel, rent, education, and more.
          </p>
        </div>

        <Link href="/expenses/create" className="button-primary shrink-0">
          Add Expense
        </Link>
      </div>

      <div className="grid gap-3 md:hidden">
        {expenses.map((expense) => (
          <article key={expense.id} className="panel p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{expense.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold capitalize text-rose-700">
                    {expense.category}
                  </span>
                  <PaymentModeBadge mode={expense.paymentMode} />
                </div>
              </div>
              <p className="font-semibold text-rose-700">
                {formatCurrency(expense.amount)}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-500">
                {expense.transactionDate.toLocaleDateString("en-IN")}
              </span>
              <div className="flex items-center gap-2">
                <Link href={`/expenses/${expense.id}`} className="button-soft">
                  View
                </Link>
                <Link
                  href={`/expenses/${expense.id}/edit`}
                  className="button-soft"
                >
                  Edit
                </Link>
                <form action={deleteExpenseAction.bind(null, expense.id)}>
                  <button
                    type="submit"
                    className="button-soft text-red-600"
                    aria-label={`Delete ${expense.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}

        {expenses.length === 0 && (
          <div className="empty-state">
            <p className="font-medium">No expenses yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first expense to understand your spending pattern.
            </p>
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{expense.title}</td>
                <td className="px-4 py-3 capitalize">{expense.category}</td>
                <td className="px-4 py-3">
                  <PaymentModeBadge mode={expense.paymentMode} />
                </td>
                <td className="px-4 py-3 font-medium text-rose-700">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3">
                  {expense.transactionDate.toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/expenses/${expense.id}`}
                      className="button-soft"
                    >
                      View
                    </Link>
                    <Link
                      href={`/expenses/${expense.id}/edit`}
                      className="button-soft"
                    >
                      Edit
                    </Link>
                    <form action={deleteExpenseAction.bind(null, expense.id)}>
                      <button type="submit" className="button-soft text-red-600">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {expenses.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500"
                >
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
