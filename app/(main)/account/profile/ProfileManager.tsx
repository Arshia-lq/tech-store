"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Grid2X2,
  Lock,
  Save,
  ShieldAlert,
  User as UserIcon,
} from "lucide-react";

interface InitialValues {
  name: string;
  email: string;
  image: string;
  role: string;
  isVerified: boolean;
}

export default function ProfileManager({
  initialValues,
}: {
  initialValues: InitialValues;
}) {
  const router = useRouter();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal info state
  const [name, setName] = useState(initialValues.name);
  const [image, setImage] = useState(initialValues.image);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage({ type: "error", text: "Image must be under 2MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpdateProfile() {
    setProfileMessage(null);
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      await update({ name, image });
      setProfileMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.message });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleUpdatePassword() {
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setPasswordMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm transition hover:text-gray-900"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Profile Settings
            </h1>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Identity & Security
            </p>
          </div>
        </div>

        <span className="hidden items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600 sm:inline-flex">
          <CheckCircle2 size={14} />
          Active Member
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
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

            {profileMessage && (
              <p
                className={`mt-4 text-sm font-semibold ${
                  profileMessage.type === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {profileMessage.text}
              </p>
            )}

            <button
              onClick={handleUpdateProfile}
              disabled={profileLoading}
              className="mt-6 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {profileLoading ? "Saving..." : "Update Profile"}
            </button>
          </div>

          
          <div
            id="password"
            className="relative overflow-hidden rounded-3xl bg-gray-900 p-6 sm:p-8 scroll-mt-24"
          >
            <Lock
              size={140}
              className="pointer-events-none absolute -right-6 -bottom-6 text-white/5"
            />

            <div className="relative mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                <ShieldAlert size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Security Center</h2>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Keep your account safe
                </p>
              </div>
            </div>

            <div className="relative space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  />
                </div>
              </div>

              {passwordMessage && (
                <p
                  className={`text-sm font-semibold ${
                    passwordMessage.type === "success" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {passwordMessage.text}
                </p>
              )}

              <button
                onClick={handleUpdatePassword}
                disabled={passwordLoading}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock size={16} />
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
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
              <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase text-green-600">
                {initialValues.role.replace("-", " ")}
              </span>

              <div className="my-5 h-px bg-gray-100" />

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Status
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    {initialValues.isVerified ? "Verified" : "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Location
                  </p>
                  <p className="text-sm font-bold text-gray-900">Global</p>
                </div>
              </div>

              <p className="mt-5 text-xs italic text-gray-400">
                "Technology is best when it brings people together."
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/account")}
            className="flex w-full items-center gap-3 rounded-3xl bg-gray-900 p-5 text-left transition hover:bg-gray-800"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-green-400">
              <Grid2X2 size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Quick Access
              </span>
              <span className="block text-sm font-bold text-white">Main Dashboard</span>
            </span>
            <ArrowRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
