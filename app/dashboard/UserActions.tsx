"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2, ShieldCheck } from "lucide-react";

const ROLES = ["user", "manager", "admin", "super-admin"];

const roleLabels: Record<string, string> = {
  user: "User",
  manager: "Manager",
  admin: "Admin",
  "super-admin": "Super-Admin",
};

interface UserActionsProps {
  userId: string;
  currentRole: string;
  canManage: boolean;
}

export default function UserActions({
  userId,
  currentRole,
  canManage,
}: UserActionsProps) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRoleChange(newRole: string) {
    setError(null);
    setIsUpdating(true);

    const previousRole = role;
    setRole(newRole);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      router.refresh();
    } catch (err: any) {
      setRole(previousRole);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This cannot be undone."
    );
    if (!confirmed) return;

    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleToggleVerify() {
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to verify user");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!canManage) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-500">
        {roleLabels[currentRole]}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {error && (
        <span className="absolute -mt-10 rounded-lg bg-red-50 px-2 py-1 text-[10px] text-red-500">
          {error}
        </span>
      )}

      <div className="relative">
        <select
          value={role}
          disabled={isUpdating}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-8 text-xs font-bold text-gray-700 outline-none transition hover:border-gray-300 focus:border-green-500 disabled:opacity-50"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      <button
        onClick={handleDelete}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        aria-label="Delete user"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}