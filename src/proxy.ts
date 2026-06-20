import { auth } from "@/auth";

export const proxy = auth(() => {});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/incomes/:path*",
    "/expenses/:path*",
    "/analytics/:path*",
    "/reports/:path*",
    "/sign-in",
  ],
};
