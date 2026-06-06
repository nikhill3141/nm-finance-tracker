import { createIncomeAction } from "../actions";

export default function CreateIncomePage() {
  return (
    <section className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Income</h1>
        <p className="text-sm text-gray-500">
          Record a source of money for the selected transaction date.
        </p>
      </div>

      <form action={createIncomeAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
            placeholder="Company, freelance client, scholarship"
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
            className="w-full rounded-md border px-3 py-2"
            placeholder="50000"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="incomeType" className="text-sm font-medium">
            Income Type
          </label>
          <select
            id="incomeType"
            name="incomeType"
            required
            className="w-full rounded-md border px-3 py-2"
          >
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
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Save Income
        </button>
      </form>
    </section>
  );
}
