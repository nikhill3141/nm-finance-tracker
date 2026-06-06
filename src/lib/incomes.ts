import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { incomes } from "@/db/schema";

export async function getIncomes(userId: string) {
  return db
    .select()
    .from(incomes)
    .where(eq(incomes.userId, userId))
    .orderBy(desc(incomes.transactionDate));
}

export async function getIncomeById(id: string, userId: string) {
  const [income] = await db
    .select()
    .from(incomes)
    .where(and(eq(incomes.id, id), eq(incomes.userId, userId)));
  return income;
}

export async function createIncome(input: {
  userId: string;
  title: string;
  sourceName: string;
  amount: string;
  incomeType: "fixed" | "variable";
  transactionDate?: Date;
}) {
  const [income] = await db
    .insert(incomes)
    .values({
      userId: input.userId,
      title: input.title,
      sourceName: input.sourceName,
      amount: input.amount,
      incomeType: input.incomeType,
      transactionDate: input.transactionDate ?? new Date(),
    })
    .returning();

  return income;
}

export async function updateIncome(
  id: string,
  userId: string,
  input: {
    title: string;
    sourceName: string;
    amount: string;
    incomeType: "fixed" | "variable";
    transactionDate?: Date;
  },
) {
  const [income] = await db
    .update(incomes)
    .set({
      title: input.title,
      sourceName: input.sourceName,
      amount: input.amount,
      incomeType: input.incomeType,
      transactionDate: input.transactionDate ?? new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(incomes.id, id), eq(incomes.userId, userId)))
    .returning();

  return income;
}

export async function deleteIncome(id: string, userId: string) {
  const [income] = await db
    .delete(incomes)
    .where(and(eq(incomes.id, id), eq(incomes.userId, userId)))
    .returning();

  return income;
}
