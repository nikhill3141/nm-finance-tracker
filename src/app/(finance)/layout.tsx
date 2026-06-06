import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/incomes", label: "Incomes" },
  { href: "/expenses", label: "Expenses" },
  { href: "/reports", label: "Reports" },
];

export default function FinanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-white p-6 md:block">
        <Link href="/dashboard" className="text-lg font-semibold">
          NM Finance
        </Link>

        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b bg-white/90 px-6 py-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-semibold">
              NM Finance
            </Link>

            <nav className="flex gap-3 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
