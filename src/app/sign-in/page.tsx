import {
  ArrowLeft,
  BarChart3,
  Check,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
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
    <main className="grid min-h-screen bg-[#07120f] p-3 text-white sm:p-5">
      <section className="grid overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#081611_0%,#0f172a_55%,#07120f_100%)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex min-h-[42rem] flex-col justify-between p-6 sm:p-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/15"
            >
              <ArrowLeft size={16} />
              Back home
            </Link>

            <div className="mt-12 max-w-2xl animate-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-200">
                <ShieldCheck size={16} />
                Secure Google sign-in
              </div>
              <h1 className="mt-6 text-4xl font-semibold sm:text-6xl">
                Start from a clean, private money workspace.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                No password setup, no clutter. Sign in and jump directly into a
                dashboard built for fast mobile tracking and serious reporting.
              </p>
            </div>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["User-owned data", "Fast daily entry", "PDF and Excel reports"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <Check className="text-emerald-300" size={18} />
                  <p className="mt-3 text-sm font-semibold">{item}</p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center justify-center bg-white p-4 text-slate-950 sm:p-8">
          <div className="w-full max-w-md animate-in">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/10 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="grid size-12 place-items-center rounded-lg bg-slate-950 text-white">
                  <WalletCards size={22} />
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  v1 secure
                </span>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-slate-500">
                  Welcome to NM Finance
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Sign in to continue
                </h2>
                <p className="mt-3 leading-7 text-slate-500">
                  Your dashboard, records, and reports are attached to your
                  Google account.
                </p>
              </div>

              {params.error ? (
                <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                  Sign in failed. Please try again.
                </p>
              ) : null}

              <form
                className="mt-6"
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
                  className="group flex min-h-14 w-full items-center justify-center rounded-lg bg-slate-950 px-5 text-center text-sm font-bold text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-900 active:translate-y-0"
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-white text-base font-black text-slate-950">
                      G
                    </span>
                    Continue with Google
                  </span>
                </button>
              </form>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <LockKeyhole className="text-slate-500" size={18} />
                  <p className="mt-3 text-sm font-semibold">Protected routes</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <BarChart3 className="text-slate-500" size={18} />
                  <p className="mt-3 text-sm font-semibold">Live reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
