import { AuthError } from "next-auth";
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
    <main className="grid min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <section className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-in space-y-6">
          <div>
            <p className="text-sm font-medium text-emerald-300">NM Finance</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Your money, cleanly organized.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
              Sign in once, then track income, expenses, balance, and monthly
              reports from a phone-friendly workspace.
            </p>
          </div>

          <div className="grid max-w-md grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-slate-300">Private</p>
              <p className="mt-1 font-semibold">User scoped</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-slate-300">Fast</p>
              <p className="mt-1 font-semibold">Mobile first</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-slate-300">Clear</p>
              <p className="mt-1 font-semibold">Reports</p>
            </div>
          </div>
        </div>

        <div className="animate-in rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/30 sm:p-6">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Welcome back</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Continue to dashboard
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Google sign-in keeps onboarding short and avoids password
              management for this v1.
            </p>
          </div>

          {params.error ? (
            <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
              Sign in failed. Please try again.
            </p>
          ) : null}

          <form
            className="mt-5"
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
              className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
