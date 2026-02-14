import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  if (role === "SELLER") {
    redirect("/dashboard/vendor");
  }

  // Default to buyer dashboard
  redirect("/dashboard/buyer");
}
