"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Camera,
  Grid2X2,
  Save,
  User as UserIcon,
} from "lucide-react";

interface InitialValues {
  name: string;
  email: string;
  image: string;
  role: string;
  isVerified: boolean;
}

export default function AccountProfile({
  initialValues,
}: {
  initialValues: InitialValues;
}) {
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialValues.name);
  const [image, setImage] = useState(initialValues.image);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be under 2MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpdateProfile() {
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      await update({ name, image });
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-500">
            <UserIcon size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Update your name and photo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              value={initialValues.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-400 outline-none"
            />
          </div>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm font-semibold ${
              message.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 pt-8 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-green-50 to-transparent" />

          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="relative mx-auto h-24 w-24">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-gray-200 shadow-sm">
                {image ? (
                  <img src={image} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <UserIcon size={32} />
                  </div>
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm transition hover:bg-green-600"
                aria-label="Change photo"
              >
                <Camera size={14} />
              </button>
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-gray-900">{name}</h3>
            <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold italic text-green-600">
              {initialValues.isVerified ? "Verified Member" : "Pending Verification"}
            </span>
          </div>
        </div>

        <Link
          href="/account"
          className="flex w-full items-center gap-3 rounded-3xl bg-gray-900 p-5 text-left transition hover:bg-gray-800"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-green-400">
            <Grid2X2 size={18} />
          </span>
          <span className="flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Quick Access
            </span>
            <span className="block text-sm font-bold text-white">Account Dashboard</span>
          </span>
          <ArrowRight size={16} className="text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
