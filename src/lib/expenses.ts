import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { expenses } from "@/db/schema";

export async function getExpenses() {
  return db.select().from(expenses).orderBy(desc(expenses.transactionDate));
}

export async function getExpenseById(id: string) {
  const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
  return expense;
}

export async function createExpense(input: {
  title: string;
  amount: string;
  category:
    | "food"
    | "rent"
    | "travel"
    | "shopping"
    | "bills"
    | "education"
    | "health"
    | "other";
  transactionDate?: Date;
}) {
  const [expense] = await db
    .insert(expenses)
    .values({
      title: input.title,
      amount: input.amount,
      category: input.category,
      transactionDate: input.transactionDate ?? new Date(),
    })
    .returning();

  return expense;
}

export async function updateExpense(
  id: string,
  input: {
    title: string;
    amount: string;
    category:
      | "food"
      | "rent"
      | "travel"
      | "shopping"
      | "bills"
      | "education"
      | "health"
      | "other";
    transactionDate?: Date;
  },
) {
  const [expense] = await db
    .update(expenses)
    .set({
      title: input.title,
      amount: input.amount,
      category: input.category,
      transactionDate: input.transactionDate ?? new Date(),
      updatedAt: new Date(),
    })
    .where(eq(expenses.id, id))
    .returning();

  return expense;
}

export async function deleteExpense(id: string) {
  const [expense] = await db
    .delete(expenses)
    .where(eq(expenses.id, id))
    .returning();

  return expense;
}
