"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ToastType = "success" | "error";

type ToastInput = {
  message: string;
  type?: ToastType;
};

type Toast = Required<ToastInput> & {
  id: number;
};

const toastMessages: Record<string, Required<ToastInput>> = {
  "expense-created": { message: "Expense saved", type: "success" },
  "expense-updated": { message: "Expense updated", type: "success" },
  "expense-deleted": { message: "Expense deleted", type: "success" },
  "expense-save-failed": { message: "Expense not saved", type: "error" },
  "expense-delete-failed": { message: "Delete failed", type: "error" },
  "income-created": { message: "Income saved", type: "success" },
  "income-updated": { message: "Income updated", type: "success" },
  "income-deleted": { message: "Income deleted", type: "success" },
  "income-save-failed": { message: "Income not saved", type: "error" },
  "income-delete-failed": { message: "Delete failed", type: "error" },
  "signed-in": { message: "Signed in", type: "success" },
  "signed-out": { message: "Signed out", type: "success" },
  "sign-in-failed": { message: "Sign in failed", type: "error" },
};

const toastEventName = "nm-finance-toast";

export function showToast({ message, type = "success" }: ToastInput) {
  window.dispatchEvent(
    new CustomEvent<Required<ToastInput>>(toastEventName, {
      detail: { message, type },
    }),
  );
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toastKey = searchParams.get("toast");

  const removeToast = useMemo(
    () => (id: number) => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    },
    [],
  );

  const addToast = useMemo(
    () =>
      ({ message, type = "success" }: ToastInput) => {
        const id = Date.now();
        setToasts((current) => [
          ...current.slice(-2),
          { id, message, type },
        ]);
        window.setTimeout(() => removeToast(id), 3200);
      },
    [removeToast],
  );

  useEffect(() => {
    function handleToast(event: Event) {
      const detail = (event as CustomEvent<Required<ToastInput>>).detail;

      if (detail?.message) {
        addToast(detail);
      }
    }

    window.addEventListener(toastEventName, handleToast);
    return () => window.removeEventListener(toastEventName, handleToast);
  }, [addToast]);

  useEffect(() => {
    if (!toastKey) {
      return;
    }

    const toast = toastMessages[toastKey];
    const timer = toast ? window.setTimeout(() => addToast(toast), 0) : null;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("toast");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [addToast, pathname, router, searchParams, toastKey]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-x-3 top-3 z-50 grid gap-2 sm:left-auto sm:right-4 sm:top-4 sm:w-80"
    >
      {toasts.map((toast) => {
        const Icon = toast.type === "success" ? CheckCircle2 : CircleAlert;
        const tone =
          toast.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/35 dark:bg-slate-950 dark:text-emerald-100"
            : "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-400/40 dark:bg-slate-950 dark:text-rose-100";

        return (
          <div
            key={toast.id}
            className={`flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 shadow-lg shadow-slate-900/10 backdrop-blur dark:shadow-black/30 ${tone}`}
          >
            <Icon
              size={20}
              className={
                toast.type === "success"
                  ? "text-emerald-600 dark:text-emerald-300"
                  : "text-rose-600 dark:text-rose-300"
              }
            />
            <p className="flex-1 text-sm font-semibold">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="grid size-7 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close toast"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
