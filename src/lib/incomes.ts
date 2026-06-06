import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { incomes } from "@/db/schema";

export async function getIncomes() {
  return db.select().from(incomes).orderBy(desc(incomes.transactionDate));
}

export async function getIncomeById(id: string) {
  const [income] = await db.select().from(incomes).where(eq(incomes.id, id));
  return income;
}

export async function createIncome(input: {
  title: string;
  sourceName: string;
  amount: string;
  incomeType: "fixed" | "variable";
  transactionDate?: Date;
}) {
  const [income] = await db
    .insert(incomes)
    .values({
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
    .where(eq(incomes.id, id))
    .returning();

  return income;
}

export async function deleteIncome(id: string) {
  const [income] = await db
    .delete(incomes)
    .where(eq(incomes.id, id))
    .returning();

  return income;
}
