import { notFound } from "next/navigation";

import { ToastForm } from "@/components/toast-form";
import { requireUserId } from "@/lib/auth-session";
import { formatTransactionDateInput } from "@/lib/date-filters";
import { getIncomeById } from "@/lib/incomes";

import { updateIncomeAction } from "../../actions";

type EditIncomePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditIncomePage({ params }: EditIncomePageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const income = await getIncomeById(id, userId);

  if (!income) {
    notFound();
  }

  return (
    <section className="animate-in max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Edit Income</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update this income record and keep reports in sync.
        </p>
      </div>

      <ToastForm
        action={updateIncomeAction.bind(null, income.id)}
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
            defaultValue={income.title}
            className="field"
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
            defaultValue={income.amount}
            className="field"
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
            className="field"
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
            defaultValue={formatTransactionDateInput(income.transactionDate)}
            className="field"
          />
        </div>

        <button type="submit" className="button-primary w-full justify-center">
          Update Income
        </button>
      </ToastForm>
    </section>
  );
}
