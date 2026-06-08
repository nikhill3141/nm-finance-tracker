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

export default async function HomePage() {
  const session = await auth();
  const primaryHref = session?.user ? "/dashboard" : "/sign-in";
  const isSignedIn = Boolean(session?.user);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <LandingNavbar primaryHref={primaryHref} isSignedIn={isSignedIn} />
      <LandingHero primaryHref={primaryHref} isSignedIn={isSignedIn} />
      <LandingFeatures />
      <ProductSection />
      <ReportsSection primaryHref={primaryHref} isSignedIn={isSignedIn} />
      <LandingCta primaryHref={primaryHref} isSignedIn={isSignedIn} />
      <LandingFooter primaryHref={primaryHref} isSignedIn={isSignedIn} />
    </main>
  );
}
