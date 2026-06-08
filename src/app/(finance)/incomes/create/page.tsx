import { ToastForm } from "@/components/toast-form";

import { createIncomeAction } from "../actions";

export default function CreateIncomePage() {
  return (
    <section className="animate-in max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Add Income</h1>
        <p className="mt-1 text-sm text-slate-500">
          Record a source of money for the selected transaction date.
        </p>
      </div>

      <ToastForm action={createIncomeAction} className="panel space-y-4 p-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="field"
            placeholder="June salary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sourceName" className="text-sm font-medium">
            Source Name
          </label>
          <input
            id="sourceName"
            name="sourceName"
            required
            className="field"
            placeholder="Company, client, scholarship"
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
            placeholder="50000"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="incomeType" className="text-sm font-medium">
            Income Type
          </label>
          <select id="incomeType" name="incomeType" required className="field">
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
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
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="field"
          />
        </div>

        <button type="submit" className="button-primary w-full justify-center">
          Save Income
        </button>
      </ToastForm>
    </section>
  );
}
