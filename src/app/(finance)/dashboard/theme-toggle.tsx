"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const storageKey = "nm-finance-theme";
const changeEvent = "nm-finance-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function toggleTheme() {
    const nextValue = !isDark;

    document.documentElement.classList.toggle("dark", nextValue);
    localStorage.setItem(storageKey, nextValue ? "dark" : "light");
    window.dispatchEvent(new Event(changeEvent));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
      aria-label="Toggle dark mode"
    >
      <span className="grid size-8 place-items-center rounded-full bg-slate-950 text-white">
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </span>
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
