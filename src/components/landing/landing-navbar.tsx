import { ArrowRight, WalletCards } from "lucide-react";
import Link from "next/link";

import { LandingThemeToggle } from "./landing-theme-toggle";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#product", label: "Product" },
  { href: "#reports", label: "Reports" },
];

type LandingNavbarProps = {
  primaryHref: string;
  isSignedIn: boolean;
};

export function LandingNavbar({ primaryHref, isSignedIn }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/88 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-950 text-white dark:bg-[#f8fafc] dark:text-[#020617]">
            <WalletCards size={19} />
          </span>
          <span className="truncate text-base text-slate-950 dark:text-white">
            NM Finance
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LandingThemeToggle />
          <Link
            href={primaryHref}
            className="landing-auth-button px-3 sm:px-4"
          >
            <span>{isSignedIn ? "Dashboard" : "Sign in"}</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-3 md:hidden">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
