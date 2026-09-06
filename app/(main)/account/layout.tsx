import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AccountTabs from "./AccountTabs";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <AccountTabs />
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">{children}</div>
    </div>
  );
}
