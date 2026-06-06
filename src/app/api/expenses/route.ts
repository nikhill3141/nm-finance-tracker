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

type ExpenseCategory = (typeof expenseCategories)[number];

function isExpenseCategory(value: string): value is ExpenseCategory {
  return expenseCategories.includes(value as ExpenseCategory);
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

    if (!isExpenseCategory(category)) {
      return errorResponse("Invalid expense category", 400, "INVALID_CATEGORY");
    }

    const expense = await createExpense({
      userId,
      title,
      amount,
      category,
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
