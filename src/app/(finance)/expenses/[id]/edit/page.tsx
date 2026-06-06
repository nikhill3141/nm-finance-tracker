import { notFound } from "next/navigation";

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
  const { id } = await params;
  const expense = await getExpenseById(id);

  if (!expense) {
    notFound();
  }

  return (
    <section className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Expense</h1>
        <p className="text-sm text-gray-500">
          Update this spending record and refresh analytics.
        </p>
      </div>

      <form
        action={updateExpenseAction.bind(null, expense.id)}
        className="space-y-4"
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
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Update Expense
        </button>
      </form>
    </section>
  );
}
