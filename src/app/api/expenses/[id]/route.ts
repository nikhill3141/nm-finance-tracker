import { deleteExpense, getExpenseById, updateExpense } from "@/lib/expenses";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth-session";

const expenseCategories = [
  "food",
  "rent",
  "travel",
  "shopping",
  "bills",
  "education",
  "health",
  "other",
] as const;

const expensePaymentModes = ["cash", "online"] as const;

type ExpenseCategory = (typeof expenseCategories)[number];
type ExpensePaymentMode = (typeof expensePaymentModes)[number];

type Params = {
  params: Promise<{
    id: string;
  }>;
};

function isExpenseCategory(value: string): value is ExpenseCategory {
  return expenseCategories.includes(value as ExpenseCategory);
}

function isExpensePaymentMode(value: string): value is ExpensePaymentMode {
  return expensePaymentModes.includes(value as ExpensePaymentMode);
}

function getString(body: Record<string, unknown>, key: string) {
  const value = body[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = await params;
    const expense = await getExpenseById(id, userId);

    if (!expense) {
      return errorResponse("Expense not found", 404, "NOT_FOUND");
    }

    return successResponse(expense);
  } catch {
    return errorResponse("Failed to fetch expense");
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;

    const title = getString(body, "title");
    const amount = getString(body, "amount");
    const category = getString(body, "category");
    const paymentMode = body.paymentMode
      ? getString(body, "paymentMode")
      : "cash";

    if (!isExpenseCategory(category)) {
      return errorResponse("Invalid expense category", 400, "INVALID_CATEGORY");
    }

    if (!isExpensePaymentMode(paymentMode)) {
      return errorResponse("Invalid payment mode", 400, "INVALID_PAYMENT_MODE");
    }

    const expense = await updateExpense(id, userId, {
      title,
      amount,
      category,
      paymentMode,
      transactionDate: body.transactionDate
        ? new Date(getString(body, "transactionDate"))
        : new Date(),
    });

    if (!expense) {
      return errorResponse("Expense not found", 404, "NOT_FOUND");
    }

    return successResponse(expense);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400, "VALIDATION_ERROR");
    }

    return errorResponse("Failed to update expense");
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = await params;
    const expense = await deleteExpense(id, userId);

    if (!expense) {
      return errorResponse("Expense not found", 404, "NOT_FOUND");
    }

    return successResponse(expense);
  } catch {
    return errorResponse("Failed to delete expense");
  }
}
