import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUserId } from "@/lib/auth-session";
import { formatCurrency } from "@/lib/format";
import { getIncomeById } from "@/lib/incomes";

type IncomeDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IncomeDetailsPage({
  params,
}: IncomeDetailsPageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const income = await getIncomeById(id, userId);

  if (!income) {
    notFound();
  }

  return (
    <section className="animate-in max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {income.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Income details</p>
      </div>

      <div className="panel p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Source</dt>
            <dd className="font-medium">{income.sourceName}</dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Amount</dt>
            <dd className="font-medium text-emerald-700">
              {formatCurrency(income.amount)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Type</dt>
            <dd className="font-medium capitalize">{income.incomeType}</dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Transaction Date</dt>
            <dd className="font-medium">
              {income.transactionDate.toLocaleDateString("en-IN")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-2">
        <Link href="/incomes" className="button-soft">
          Back
        </Link>

        <Link href={`/incomes/${income.id}/edit`} className="button-primary">
          Edit
        </Link>
      </div>
    </section>
  );
}
