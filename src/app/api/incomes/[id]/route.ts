import { deleteIncome, getIncomeById, updateIncome } from "@/lib/incomes";
import { errorResponse, successResponse } from "@/lib/api-response";

const incomeTypes = ["fixed", "variable"] as const;

type IncomeType = (typeof incomeTypes)[number];

type Params = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const income = await getIncomeById(id);

    if (!income) {
      return errorResponse("Income not found", 404, "NOT_FOUND");
    }

    return successResponse(income);
  } catch {
    return errorResponse("Failed to fetch income");
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;

    const title = getString(body, "title");
    const sourceName = getString(body, "sourceName");
    const amount = getString(body, "amount");
    const incomeType = getString(body, "incomeType");

    if (!isIncomeType(incomeType)) {
      return errorResponse("Invalid income type", 400, "INVALID_INCOME_TYPE");
    }

    const income = await updateIncome(id, {
      title,
      sourceName,
      amount,
      incomeType,
      transactionDate: body.transactionDate
        ? new Date(getString(body, "transactionDate"))
        : new Date(),
    });

    if (!income) {
      return errorResponse("Income not found", 404, "NOT_FOUND");
    }

    return successResponse(income);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400, "VALIDATION_ERROR");
    }

    return errorResponse("Failed to update income");
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const income = await deleteIncome(id);

    if (!income) {
      return errorResponse("Income not found", 404, "NOT_FOUND");
    }

    return successResponse(income);
  } catch {
    return errorResponse("Failed to delete income");
  }
}
