"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Briefcase,
  ShieldCheck,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck as BadgeIcon,
  Quote,
} from "lucide-react";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const demoAccounts = [
  {
    label: "User",
    description: "Customer Access",
    email: "user@demo.com",
    password: "user1234",
    badge: "user",
    icon: User,
    accent: "border-blue-200 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-600",
    iconColor: "text-blue-500",
  },
  {
    label: "Manager",
    description: "Store Manager",
    email: "manager@demo.com",
    password: "manager1234",
    badge: "manager",
    icon: Briefcase,
    accent: "border-green-200 bg-green-50",
    badgeColor: "bg-green-100 text-green-600",
    iconColor: "text-green-500",
  },
  {
    label: "Admin",
    description: "System Admin",
    email: "admin@demo.com",
    password: "admin1234",
    badge: "admin",
    icon: ShieldCheck,
    accent: "border-amber-200 bg-amber-50",
    badgeColor: "bg-amber-100 text-amber-600",
    iconColor: "text-amber-500",
  },
  {
    label: "Super Admin",
    description: "Full Access",
    email: "superadmin@demo.com",
    password: "superadmin1234",
    badge: "super-admin",
    icon: Crown,
    accent: "border-purple-200 bg-purple-50",
    badgeColor: "bg-purple-100 text-purple-600",
    iconColor: "text-purple-500",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(email: string, password: string) {
    setFormError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setFormError("Invalid email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function onSubmit(values: LoginFormValues) {
    await handleLogin(values.email, values.password);
  }

  async function handleDemoLogin(account: (typeof demoAccounts)[number]) {
    setLoadingDemo(account.badge);
    await handleLogin(account.email, account.password);
    setLoadingDemo(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="p-8 lg:p-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
            <KeyRound size={13} />
            Secure Authentication
          </span>

          <h1 className="mt-5 text-3xl font-bold text-gray-900 lg:text-4xl">
            Welcome <span className="text-green-500">Back</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your dashboard, track orders, and manage
            settings.
          </p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <Sparkles size={13} className="text-amber-400" />
                Demo Accounts
              </span>
              <span className="text-xs text-gray-400">One-click sign in</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.badge}
                  type="button"
                  onClick={() => handleDemoLogin(account)}
                  disabled={loadingDemo !== null}
                  className={`rounded-xl border p-3 text-left transition hover:shadow-sm disabled:opacity-60 ${account.accent}`}
                >
                  <div className="flex items-center justify-between">
                    <account.icon size={16} className={account.iconColor} />
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${account.badgeColor}`}
                    >
                      {account.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {loadingDemo === account.badge
                      ? "Signing in…"
                      : account.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {account.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Or login with email
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {formError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </p>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email Address
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10">
                <Lock size={16} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSubmitting ? "LOGGING IN…" : "LOG IN"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-green-600 hover:text-green-700"
              >
                Register now
              </Link>
            </p>
            <span className="flex items-center gap-1 text-gray-400">
              <BadgeIcon size={13} className="text-green-500" />
              SSL Encrypted
            </span>
          </div>
        </div>

        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <span className="absolute left-6 top-6 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800">
            <ShieldCheck size={13} className="text-green-500" />
            Role-Based Access Control
          </span>

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-black/50 p-5 backdrop-blur-sm">
            <Quote size={20} className="text-white/60" />
            <p className="mt-2 text-sm leading-relaxed text-white">
              The ecosystem provided by Tech Store completely transformed
              how our team approaches hardware management.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-300">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200"
                  alt="Sarah Jenkins"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Sarah Jenkins
                </p>
                <p className="text-[10px] uppercase tracking-wide text-white/60">
                  Lead Architect, Nexus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
