import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Home" },
  { href: "/incomes", label: "Incomes", shortLabel: "Income" },
  { href: "/expenses", label: "Expenses", shortLabel: "Spend" },
  { href: "/reports", label: "Reports", shortLabel: "Reports" },
];

export default async function FinanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "NM";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur md:block">
        <Link href="/dashboard" className="block">
          <span className="text-sm font-medium text-emerald-700">
            NM Finance
          </span>
          <span className="mt-1 block text-2xl font-semibold tracking-tight">
            Money Tracker
          </span>
        </Link>

        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <div className="grid size-10 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <form
            className="mt-4"
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/sign-in" });
            }}
          >
            <button type="submit" className="button-soft w-full justify-center">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="font-semibold tracking-tight">
              NM Finance
            </Link>

            <div className="flex items-center gap-2">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <div className="grid size-9 place-items-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 md:py-8 md:pb-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.slice(0, 2).map((item) => (
            <Link key={item.href} href={item.href} className="mobile-nav-link">
              {item.shortLabel}
            </Link>
          ))}
          <Link
            href="/expenses/create"
            className="grid min-h-12 place-items-center rounded-full bg-slate-950 px-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 active:scale-95"
          >
            Add
          </Link>
          {navItems.slice(2).map((item) => (
            <Link key={item.href} href={item.href} className="mobile-nav-link">
              {item.shortLabel}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
