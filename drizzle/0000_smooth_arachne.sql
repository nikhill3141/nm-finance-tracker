CREATE TYPE "public"."expense_category" AS ENUM('food', 'rent', 'travel', 'shopping', 'bills', 'education', 'health', 'other');--> statement-breakpoint
CREATE TYPE "public"."income_type" AS ENUM('fixed', 'variable');--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(120) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"category" "expense_category" NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(120) NOT NULL,
	"source_name" varchar(120) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"income_type" "income_type" NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
