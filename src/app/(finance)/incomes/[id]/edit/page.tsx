import { notFound } from "next/navigation";

import { getIncomeById } from "@/lib/incomes";

import { updateIncomeAction } from "../../actions";

type EditIncomePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditIncomePage({ params }: EditIncomePageProps) {
  const { id } = await params;
  const income = await getIncomeById(id);

  if (!income) {
    notFound();
  }

  return (
    <section className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Income</h1>
        <p className="text-sm text-gray-500">
          Update this income record and keep reports in sync.
        </p>
      </div>

      <form
        action={updateIncomeAction.bind(null, income.id)}
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
            defaultValue={income.title}
            className="w-full rounded-md border px-3 py-2"
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
            defaultValue={income.sourceName}
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
            defaultValue={income.amount}
            className="w-full rounded-md border px-3 py-2"
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
            defaultValue={income.incomeType}
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
            defaultValue={income.transactionDate.toISOString().slice(0, 10)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Update Income
        </button>
      </form>
    </section>
  );
}
