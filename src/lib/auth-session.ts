import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function requireUserId() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}
