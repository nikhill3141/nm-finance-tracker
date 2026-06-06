"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createIncome, deleteIncome, updateIncome } from "@/lib/incomes";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

export async function createIncomeAction(formData: FormData) {
  const title = getRequiredString(formData, "title");
  const sourceName = getRequiredString(formData, "sourceName");
  const amount = getRequiredString(formData, "amount");
  const incomeType = getRequiredString(formData, "incomeType") as
    | "fixed"
    | "variable";
  const transactionDate = getRequiredString(formData, "transactionDate");

  await createIncome({
    title,
    sourceName,
    amount,
    incomeType,
    transactionDate: new Date(transactionDate),
  });

  revalidatePath("/incomes");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/incomes");
}

export async function updateIncomeAction(id: string, formData: FormData) {
  const title = getRequiredString(formData, "title");
  const sourceName = getRequiredString(formData, "sourceName");
  const amount = getRequiredString(formData, "amount");
  const incomeType = getRequiredString(formData, "incomeType") as
    | "fixed"
    | "variable";
  const transactionDate = getRequiredString(formData, "transactionDate");

  await updateIncome(id, {
    title,
    sourceName,
    amount,
    incomeType,
    transactionDate: new Date(transactionDate),
  });

  revalidatePath("/incomes");
  revalidatePath("/incomes/[id]", "page");
  revalidatePath(`/incomes/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/incomes");

}

export async function deleteIncomeAction(id: string) {
  await deleteIncome(id);

  revalidatePath("/incomes");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}
