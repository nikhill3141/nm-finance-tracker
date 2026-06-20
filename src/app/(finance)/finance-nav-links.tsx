"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type FinanceNavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

type FinanceNavLinksProps = {
  addHref?: string;
  addLabel?: string;
  items: FinanceNavItem[];
  variant: "desktop" | "mobile";
};

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FinanceNavLinks({
  addHref,
  addLabel = "Add",
  items,
  variant,
}: FinanceNavLinksProps) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav className="mt-8 flex flex-col gap-2">
        {items.map((item) => {
          const isActive = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={isActive ? "page" : undefined}
              className={`nav-link ${
                isActive ? "nav-link-active" : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
      {items.slice(0, 2).map((item) => {
        const isActive = isRouteActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={isActive ? "page" : undefined}
            className={`mobile-nav-link ${
              isActive ? "mobile-nav-link-active" : ""
            }`}
          >
            {item.shortLabel}
          </Link>
        );
      })}

      {addHref ? (
        <Link
          href={addHref}
          prefetch={false}
          aria-current={isRouteActive(pathname, addHref) ? "page" : undefined}
          className={`grid min-h-12 place-items-center rounded-full px-3 text-sm font-semibold text-white shadow-lg active:scale-95 ${
            isRouteActive(pathname, addHref)
              ? "bg-emerald-600 shadow-emerald-300"
              : "bg-slate-950 shadow-slate-300"
          }`}
        >
          {addLabel}
        </Link>
      ) : null}

      {items.slice(2).map((item) => {
        const isActive = isRouteActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={isActive ? "page" : undefined}
            className={`mobile-nav-link ${
              isActive ? "mobile-nav-link-active" : ""
            }`}
          >
            {item.shortLabel}
          </Link>
        );
      })}
    </div>
  );
}
