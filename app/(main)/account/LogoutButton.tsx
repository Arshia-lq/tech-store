"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <LogOut size={24} />
      </span>
      <h3 className="mt-4 text-base font-bold text-gray-900">Logout</h3>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        Sign out of your account
      </p>
    </button>
  );
}
