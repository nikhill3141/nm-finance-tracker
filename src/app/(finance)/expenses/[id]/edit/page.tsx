import { Banknote, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";

import { SubmitButton } from "@/components/submit-button";
import { ToastForm } from "@/components/toast-form";
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

const paymentModes = [
  {
    value: "cash",
    label: "Cash",
    description: "Paid with notes or coins",
    icon: Banknote,
  },
  {
    value: "online",
    label: "Online",
    description: "UPI, card, wallet, or bank",
    icon: CreditCard,
  },
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
        <h1 className="text-3xl font-semibold">Edit Expense</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update this spending record and refresh analytics.
        </p>
      </div>

      <ToastForm
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

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Payment Mode</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {paymentModes.map((mode) => (
              <label
                key={mode.value}
                className="group relative flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value={mode.value}
                  defaultChecked={expense.paymentMode === mode.value}
                  className="peer sr-only"
                />
                <span className="grid size-11 place-items-center rounded-full bg-slate-100 text-slate-700 transition peer-checked:bg-slate-950 peer-checked:text-white">
                  <mode.icon size={20} />
                </span>
                <span>
                  <span className="block font-semibold">{mode.label}</span>
                  <span className="block text-xs text-slate-500">
                    {mode.description}
                  </span>
                </span>
                <span className="absolute inset-0 rounded-lg ring-0 ring-emerald-400 transition peer-checked:ring-2" />
              </label>
            ))}
          </div>
        </fieldset>

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

        <SubmitButton
          pendingText="Updating expense..."
          className="button-primary w-full justify-center"
        >
          Update Expense
        </SubmitButton>
      </ToastForm>
    </section>
  );
}
