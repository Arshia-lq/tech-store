"use client";

import { useSession } from "next-auth/react";
import { Search, Bell } from "lucide-react";

export default function DashboardTopbar() {
  const { data: session } = useSession();

  return (
    <div className="flex h-20 items-center justify-between gap-4 border-b border-gray-100 bg-white px-6">
      <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search data..."
          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <button className="text-gray-400 hover:text-gray-600" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-bold text-gray-900">
              {session?.user?.name}
            </p>
            <p className="text-[10px] font-bold uppercase text-green-500">
              {session?.user?.role}
            </p>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
