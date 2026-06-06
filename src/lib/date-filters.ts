export type PeriodFilter = "this-month" | "last-month" | "all";

export function normalizePeriod(value: unknown): PeriodFilter {
  if (value === "last-month") return "last-month";
  if (value === "all") return "all";

  return "this-month";
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
 