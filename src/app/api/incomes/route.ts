import { createIncome, getIncomes } from "@/lib/incomes";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth-session";

const incomeTypes = ["fixed", "variable"] as const;

type IncomeType = (typeof incomeTypes)[number];

function isIncomeType(value: string): value is IncomeType {
  return incomeTypes.includes(value as IncomeType);
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

    const incomes = await getIncomes(userId);
    return successResponse(incomes);
  } catch {
    return errorResponse("Failed to fetch incomes");
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
    const sourceName = getString(body, "sourceName");
    const amount = getString(body, "amount");
    const incomeType = getString(body, "incomeType");

    if (!isIncomeType(incomeType)) {
      return errorResponse("Invalid income type", 400, "INVALID_INCOME_TYPE");
    }

    const income = await createIncome({
      userId,
      title,
      sourceName,
      amount,
      incomeType,
      transactionDate: body.transactionDate
        ? new Date(getString(body, "transactionDate"))
        : new Date(),
    });

    return successResponse(income, 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400, "VALIDATION_ERROR");
    }

    return errorResponse("Failed to create income");
  }
}
