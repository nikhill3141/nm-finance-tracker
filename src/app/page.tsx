import { LandingNavbar } from "@/components/landing/landing-navbar";
import {
  LandingCta,
  LandingFeatures,
  LandingFooter,
  LandingHero,
  ProductSection,
  ReportsSection,
} from "@/components/landing/landing-page-sections";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <LandingNavbar primaryHref="/sign-in" isSignedIn={false} />
      <LandingHero primaryHref="/sign-in" isSignedIn={false} />
      <LandingFeatures />
      <ProductSection />
      <ReportsSection primaryHref="/sign-in" isSignedIn={false} />
      <LandingCta primaryHref="/sign-in" isSignedIn={false} />
      <LandingFooter primaryHref="/sign-in" isSignedIn={false} />
    </main>
  );
}
