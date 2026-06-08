import { createExpense, getExpenses } from "@/lib/expenses";
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

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }

    const expenses = await getExpenses(userId);
    return successResponse(expenses);
  } catch {
    return errorResponse("Failed to fetch expenses");
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }

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

    const expense = await createExpense({
      userId,
      title,
      amount,
      category,
      paymentMode,
      transactionDate: body.transactionDate
        ? new Date(getString(body, "transactionDate"))
        : new Date(),
    });

    return successResponse(expense, 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400, "VALIDATION_ERROR");
    }

    return errorResponse("Failed to create expense");
  }
}
