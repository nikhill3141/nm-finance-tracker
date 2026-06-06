import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { expenses } from "@/db/schema";

export async function getExpenses(userId: string) {
  return db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.transactionDate));
}

export async function getExpenseById(id: string, userId: string) {
  const [expense] = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)));
  return expense;
}

export async function createExpense(input: {
  userId: string;
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
      userId: input.userId,
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
  userId: string,
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
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning();

  return expense;
}

export async function deleteExpense(id: string, userId: string) {
  const [expense] = await db
    .delete(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning();

  return expense;
}
