import Link from "next/link";
import { notFound } from "next/navigation";

import { getIncomeById } from "@/lib/incomes";

type IncomeDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IncomeDetailsPage({
  params,
}: IncomeDetailsPageProps) {
  const { id } = await params;
  const income = await getIncomeById(id);

  if (!income) {
    notFound();
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{income.title}</h1>
        <p className="text-sm text-gray-500">Income details</p>
      </div>

      <div className="rounded-lg border p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Source</dt>
            <dd className="font-medium">{income.sourceName}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Amount</dt>
            <dd className="font-medium">₹{income.amount}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Type</dt>
            <dd className="font-medium capitalize">{income.incomeType}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Transaction Date</dt>
            <dd className="font-medium">
              {income.transactionDate.toLocaleDateString("en-IN")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-2">
        <Link href="/incomes" className="rounded-md border px-4 py-2 text-sm">
          Back
        </Link>

        <Link
          href={`/incomes/${income.id}/edit`}
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          Edit
        </Link>
      </div>
    </section>
  );
}
