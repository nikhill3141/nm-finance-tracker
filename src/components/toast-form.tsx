"use client";

import { showToast } from "./toast-provider";

type ToastFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
};

export function ToastForm({ action, children, className = "" }: ToastFormProps) {
  return (
    <form
      action={action}
      className={className}
      onInvalidCapture={() => {
        showToast({ message: "Fill required fields", type: "error" });
      }}
    >
      {children}
    </form>
  );
}
