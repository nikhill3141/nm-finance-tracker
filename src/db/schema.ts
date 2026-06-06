import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

export const incomeTypeEnum = pgEnum("income_type", ["fixed", "variable"]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "food",
  "rent",
  "travel",
  "shopping",
  "bills",
  "education",
  "health",
  "other",
]);

export const incomes = pgTable("incomes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 120 }).notNull(),
  sourceName: varchar("source_name", { length: 120 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  incomeType: incomeTypeEnum("income_type").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 120 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  category: expenseCategoryEnum("category").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
