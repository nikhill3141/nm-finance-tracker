import Link from "next/link";
import { notFound } from "next/navigation";

import { getExpenseById } from "@/lib/expenses";

type ExpenseDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExpenseDetailsPage({
  params,
}: ExpenseDetailsPageProps) {
  const { id } = await params;
  const expense = await getExpenseById(id);

  if (!expense) {
    notFound();
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{expense.title}</h1>
        <p className="text-sm text-gray-500">Expense details</p>
      </div>

      <div className="rounded-lg border p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Category</dt>
            <dd className="font-medium capitalize">{expense.category}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Amount</dt>
            <dd className="font-medium">₹{expense.amount}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Transaction Date</dt>
            <dd className="font-medium">
              {expense.transactionDate.toLocaleDateString("en-IN")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-2">
        <Link href="/expenses" className="rounded-md border px-4 py-2 text-sm">
          Back
        </Link>

        <Link
          href={`/expenses/${expense.id}/edit`}
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          Edit
        </Link>
      </div>
    </section>
  );
}
