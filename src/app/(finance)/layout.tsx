import Link from "next/link";

export default function FinanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <nav>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/incomes">Incomes</Link>
        <Link href="/expenses">Expenses</Link>
        <Link href="/reports">Reports</Link>
      </nav>

      <main>{children}</main>
    </div>
  );
}
