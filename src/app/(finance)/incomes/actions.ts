"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUserId } from "@/lib/auth-session";
import { parseTransactionDateInput } from "@/lib/date-filters";
import { createIncome, deleteIncome, updateIncome } from "@/lib/incomes";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

export async function createIncomeAction(formData: FormData) {
  const userId = await requireUserId();

  try {
    const title = getRequiredString(formData, "title");
    const sourceName = getRequiredString(formData, "sourceName");
    const amount = getRequiredString(formData, "amount");
    const incomeType = getRequiredString(formData, "incomeType") as
      | "fixed"
      | "variable";
    const transactionDate = getRequiredString(formData, "transactionDate");

    await createIncome({
      userId,
      title,
      sourceName,
      amount,
      incomeType,
      transactionDate: parseTransactionDateInput(transactionDate),
    });
  } catch {
    redirect("/incomes/create?toast=income-save-failed");
  }

  revalidatePath("/incomes");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/incomes?toast=income-created");
}

export async function updateIncomeAction(id: string, formData: FormData) {
  const userId = await requireUserId();

  try {
    const title = getRequiredString(formData, "title");
    const sourceName = getRequiredString(formData, "sourceName");
    const amount = getRequiredString(formData, "amount");
    const incomeType = getRequiredString(formData, "incomeType") as
      | "fixed"
      | "variable";
    const transactionDate = getRequiredString(formData, "transactionDate");

    await updateIncome(id, userId, {
      title,
      sourceName,
      amount,
      incomeType,
      transactionDate: parseTransactionDateInput(transactionDate),
    });
  } catch {
    redirect(`/incomes/${id}/edit?toast=income-save-failed`);
  }

  revalidatePath("/incomes");
  revalidatePath("/incomes/[id]", "page");
  revalidatePath(`/incomes/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/incomes?toast=income-updated");
}

export async function deleteIncomeAction(id: string) {
  const userId = await requireUserId();

  try {
    await deleteIncome(id, userId);
  } catch {
    redirect("/incomes?toast=income-delete-failed");
  }

  revalidatePath("/incomes");
  revalidatePath("/dashboard");
  revalidatePath("/reports");

  redirect("/incomes?toast=income-deleted");
}
