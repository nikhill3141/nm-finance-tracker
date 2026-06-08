export type PeriodFilter = "this-month" | "last-month" | "all";

const dateInputPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function normalizePeriod(value: unknown): PeriodFilter {
  if (value === "last-month") return "last-month";
  if (value === "all") return "all";

  return "this-month";
}

export function parseTransactionDateInput(value: string) {
  const match = dateInputPattern.exec(value);

  if (!match) {
    throw new Error("Invalid transaction date");
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Invalid transaction date");
  }

  return date;
}

export function formatTransactionDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateRange(period: PeriodFilter) {
  const now = new Date();

  if (period === "all") {
    return {
      start: null,
      end: null,
    };
  }

  if (period === "last-month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);

    return { start, end };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { start, end };
}

export function isWithinDateRange(
  date: Date,
  range: {
    start: Date | null;
    end: Date | null;
  },
) {
  if (!range.start || !range.end) {
    return true;
  }

  return date >= range.start && date < range.end;
}
