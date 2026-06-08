import { Banknote, CreditCard } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUserId } from "@/lib/auth-session";
import { getExpenseById } from "@/lib/expenses";
import { formatCurrency } from "@/lib/format";

type ExpenseDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExpenseDetailsPage({
  params,
}: ExpenseDetailsPageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const expense = await getExpenseById(id, userId);

  if (!expense) {
    notFound();
  }

  const PaymentIcon = expense.paymentMode === "cash" ? Banknote : CreditCard;

  return (
    <section className="animate-in max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          {expense.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Expense details</p>
      </div>

      <div className="panel p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Category</dt>
            <dd className="font-medium capitalize">{expense.category}</dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Amount</dt>
            <dd className="font-medium text-rose-700">
              {formatCurrency(expense.amount)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Transaction Date</dt>
            <dd className="font-medium">
              {expense.transactionDate.toLocaleDateString("en-IN")}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Payment Mode</dt>
            <dd className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold capitalize text-slate-700">
              <PaymentIcon size={16} />
              {expense.paymentMode}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-2">
        <Link href="/expenses" className="button-soft">
          Back
        </Link>

        <Link href={`/expenses/${expense.id}/edit`} className="button-primary">
          Edit
        </Link>
      </div>
    </section>
  );
}
