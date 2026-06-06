import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";

const protectedRoutes = ["/dashboard", "/incomes", "/expenses", "/reports"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ request, auth }) {
      const pathname = request.nextUrl.pathname;
      const isLoggedIn = Boolean(auth?.user);
      const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      );

      if (pathname === "/sign-in" && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (isProtectedRoute) {
        return isLoggedIn;
      }

      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
