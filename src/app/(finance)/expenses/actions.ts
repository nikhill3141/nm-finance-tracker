"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUserId } from "@/lib/auth-session";
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

type ExpensePaymentMode = "cash" | "online";

const expenseCategories: ExpenseCategory[] = [
  "food",
  "rent",
  "travel",
  "shopping",
  "bills",
  "education",
  "health",
  "other",
];

const paymentModes: ExpensePaymentMode[] = ["cash", "online"];

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function getExpenseCategory(formData: FormData) {
  const category = getRequiredString(formData, "category");

  if (!expenseCategories.includes(category as ExpenseCategory)) {
    throw new Error("Invalid expense category");
  }

  return category as ExpenseCategory;
}

function getPaymentMode(formData: FormData) {
  const paymentMode = getRequiredString(formData, "paymentMode");

  if (!paymentModes.includes(paymentMode as ExpensePaymentMode)) {
    throw new Error("Invalid payment mode");
  }

  return paymentMode as ExpensePaymentMode;
}

export async function createExpenseAction(formData: FormData) {
  const userId = await requireUserId();
  const title = getRequiredString(formData, "title");
  const amount = getRequiredString(formData, "amount");
  const category = getExpenseCategory(formData);
  const paymentMode = getPaymentMode(formData);
  const transactionDate = getRequiredString(formData, "transactionDate");

  await createExpense({
    userId,
    title,
    amount,
    category,
    paymentMode,
    transactionDate: new Date(transactionDate),
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/expenses");
}

export async function updateExpenseAction(id: string, formData: FormData) {
  const userId = await requireUserId();
  const title = getRequiredString(formData, "title");
  const amount = getRequiredString(formData, "amount");
  const category = getExpenseCategory(formData);
  const paymentMode = getPaymentMode(formData);
  const transactionDate = getRequiredString(formData, "transactionDate");

  await updateExpense(id, userId, {
    title,
    amount,
    category,
    paymentMode,
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
  const userId = await requireUserId();

  await deleteExpense(id, userId);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}
