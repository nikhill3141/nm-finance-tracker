import { notFound } from "next/navigation";

import { requireUserId } from "@/lib/auth-session";
import { getExpenseById } from "@/lib/expenses";

import { updateExpenseAction } from "../../actions";

const categories = [
  "food",
  "rent",
  "travel",
  "shopping",
  "bills",
  "education",
  "health",
  "other",
];

type EditExpensePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditExpensePage({
  params,
}: EditExpensePageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const expense = await getExpenseById(id, userId);

  if (!expense) {
    notFound();
  }

  return (
    <section className="animate-in max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Expense</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update this spending record and refresh analytics.
        </p>
      </div>

      <form
        action={updateExpenseAction.bind(null, expense.id)}
        className="panel space-y-4 p-5"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={expense.title}
            className="field"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            required
            defaultValue={expense.amount}
            className="field"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={expense.category}
            className="field"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="transactionDate" className="text-sm font-medium">
            Transaction Date
          </label>
          <input
            id="transactionDate"
            name="transactionDate"
            type="date"
            required
            defaultValue={expense.transactionDate.toISOString().slice(0, 10)}
            className="field"
          />
        </div>

        <button type="submit" className="button-primary w-full justify-center">
          Update Expense
        </button>
      </form>
    </section>
  );
}
