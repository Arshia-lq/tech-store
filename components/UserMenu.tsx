"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, LayoutGrid, User, LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2"
      >
        <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name ?? "User"}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="hidden text-left lg:block">
          <p className="text-[10px] font-semibold text-gray-800">
            {session.user.name}
          </p>
          <p className="text-[8px] font-bold uppercase text-green-500">
            {session.user.role}
          </p>
        </div>

        <ChevronDown
          size={14}
          className={`hidden text-gray-400 transition-transform lg:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-100">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-200">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {session.user.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {session.user.email}
              </p>
            </div>
          </div>

          <span className="mt-3 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-600">
            {session.user.role}
          </span>

          <div className="mt-4 flex flex-col gap-1">
            <Link
              href={
                ["super-admin", "admin", "manager"].includes(session.user.role as string)
                  ? "/dashboard"
                  : "/account"
              }
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <LayoutGrid size={16} className="text-gray-400" />
              Dashboard
            </Link>

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <User size={16} className="text-gray-400" />
              Profile
            </Link>
          </div>

          <div className="my-3 h-px bg-gray-100" />

          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
