"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createExpense, deleteExpense, updateExpense } from "@/lib/expenses";

type ExpenseCategory =
  | "food"
  | "rent"
  | "travel"
  | "shopping"
  | "bills"
  | "education"
  | "health"
  | "other";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

export async function createExpenseAction(formData: FormData) {
  const title = getRequiredString(formData, "title");
  const amount = getRequiredString(formData, "amount");
  const category = getRequiredString(formData, "category") as ExpenseCategory;
  const transactionDate = getRequiredString(formData, "transactionDate");

  await createExpense({
    title,
    amount,
    category,
    transactionDate: new Date(transactionDate),
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/expenses");
}

export async function updateExpenseAction(id: string, formData: FormData) {
  const title = getRequiredString(formData, "title");
  const amount = getRequiredString(formData, "amount");
  const category = getRequiredString(formData, "category") as ExpenseCategory;
  const transactionDate = getRequiredString(formData, "transactionDate");

  await updateExpense(id, {
    title,
    amount,
    category,
    transactionDate: new Date(transactionDate),
  });

  revalidatePath("/expenses");
  revalidatePath("/expenses/[id]", "page");
  revalidatePath(`/expenses/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/expenses");
}

export async function deleteExpenseAction(id: string) {
  await deleteExpense(id);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}
