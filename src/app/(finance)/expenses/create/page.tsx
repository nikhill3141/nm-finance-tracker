import { Banknote, CreditCard } from "lucide-react";

import { SubmitButton } from "@/components/submit-button";
import { ToastForm } from "@/components/toast-form";

import { createExpenseAction } from "../actions";

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

export default function CreateExpensePage() {
  return (
    <section className="animate-in max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Add Expense</h1>
        <p className="mt-1 text-sm text-slate-500">
          Record spending with a category and transaction date.
        </p>
      </div>

      <ToastForm action={createExpenseAction} className="panel space-y-4 p-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="field"
            placeholder="Metro card recharge"
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
            className="field"
            placeholder="1500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select id="category" name="category" required className="field">
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
                  defaultChecked={mode.value === "cash"}
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
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="field"
          />
        </div>

        <SubmitButton
          pendingText="Saving expense..."
          className="button-primary w-full justify-center"
        >
          Save Expense
        </SubmitButton>
      </ToastForm>
    </section>
  );
}
