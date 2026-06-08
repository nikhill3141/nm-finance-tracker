import { ArrowLeft, LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";
import { AuthError } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#06110f] px-4 py-6 text-white sm:px-6">
      <div className="w-full max-w-md animate-in">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/15"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <section className="rounded-lg border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/35 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="grid size-12 place-items-center rounded-lg bg-slate-950 text-white">
              <WalletCards size={22} />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <ShieldCheck size={14} />
              Secure
            </span>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-semibold">Continue to NM Finance</h1>
            <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-500">
              Use your Google account to open your private cash flow dashboard.
            </p>
          </div>

          {params.error ? (
            <p className="mt-5 rounded-lg bg-rose-50 p-3 text-center text-sm font-medium text-rose-700">
              Google sign-in failed. Please try again.
            </p>
          ) : null}

          <form
            className="mt-7"
            action={async () => {
              "use server";
              try {
                await signIn("google", { redirectTo: callbackUrl });
              } catch (error) {
                if (error instanceof AuthError) {
                  redirect("/sign-in?error=auth");
                }

                throw error;
              }
            }}
          >
            <button
              type="submit"
              className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-[#ffffff] px-5 text-center text-sm font-bold text-[#1f2937] transition hover:border-slate-400 hover:bg-[#f8fafc] dark:border-slate-600 dark:bg-[#f8fafc] dark:text-[#020617] dark:hover:bg-[#e2e8f0]"
            >
              <GoogleMark />
              Continue with Google
            </button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-lg bg-slate-50 p-4">
            <LockKeyhole className="mt-0.5 text-slate-500" size={18} />
            <p className="text-sm leading-6 text-slate-600">
              No password to remember. Your records stay connected to your
              Google identity.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      role="img"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
