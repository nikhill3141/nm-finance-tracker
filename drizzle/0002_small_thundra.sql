CREATE TYPE "public"."expense_payment_mode" AS ENUM('cash', 'online');--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "payment_mode" "expense_payment_mode" DEFAULT 'cash' NOT NULL;