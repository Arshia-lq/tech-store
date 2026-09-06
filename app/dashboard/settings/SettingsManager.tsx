"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Mail,
  LayoutTemplate,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Save,
  Image as ImageIcon,
} from "lucide-react";

interface SettingsValues {
  siteName: string;
  siteLogo: string;
  siteDescription: string;
  contactEmail: string;
  footerText: string;
  activePaymentMethods: string[];
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  paymentInstructions: string;
}

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", icon: Truck },
  { value: "bkash", label: "bKash", icon: null, badge: "bK" },
  { value: "nagad", label: "Nagad", icon: null, badge: "N" },
  { value: "rocket", label: "Rocket", icon: null, badge: "R" },
  { value: "sslcommerz", label: "SSLCommerz", icon: Globe },
  { value: "stripe", label: "Stripe", icon: CreditCard },
];

export default function SettingsManager({
  initialValues,
}: {
  initialValues: SettingsValues;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function togglePaymentMethod(value: string) {
    setForm((prev) => {
      const isActive = prev.activePaymentMethods.includes(value);
      return {
        ...prev,
        activePaymentMethods: isActive
          ? prev.activePaymentMethods.filter((m) => m !== value)
          : [...prev.activePaymentMethods, value],
      };
    });
  }

  async function handleSave() {
    setError(null);
    setMessage(null);
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setMessage("Global settings saved successfully.");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}
      {message && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">{message}</p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold text-green-600">
            <Globe size={16} />
            Brand Identity
          </h2>
          <div className="my-4 h-px bg-gray-100" />

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Platform Name
              </label>
              <input
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Logo URL
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10">
                <ImageIcon size={14} className="text-gray-400" />
                <input
                  placeholder="https://example.com/logo.png"
                  value={form.siteLogo}
                  onChange={(e) => setForm({ ...form, siteLogo: e.target.value })}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold text-green-600">
            <Mail size={16} />
            Contact Info
          </h2>
          <div className="my-4 h-px bg-gray-100" />

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Support Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Footer Text
              </label>
              <input
                value={form.footerText}
                onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold text-green-600">
          <LayoutTemplate size={16} />
          Platform Description
        </h2>
        <div className="my-4 h-px bg-gray-100" />

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
          SEO Description
        </label>
        <textarea
          rows={4}
          value={form.siteDescription}
          onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
        />
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-green-600">
            <CreditCard size={16} />
            Payment Gateways
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
            Select Active Methods
          </span>
        </div>
        <div className="my-4 h-px bg-gray-100" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const isActive = form.activePaymentMethods.includes(method.value);
            const Icon = method.icon;

            return (
              <button
                key={method.value}
                type="button"
                onClick={() => togglePaymentMethod(method.value)}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                  isActive
                    ? "border-green-500 bg-green-50"
                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? "bg-white text-green-600" : "bg-white text-gray-400"
                  }`}
                >
                  {Icon ? <Icon size={14} /> : method.badge}
                </span>
                <span
                  className={`flex-1 text-sm font-semibold ${
                    isActive ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {method.label}
                </span>
                {isActive ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <XCircle size={16} className="text-gray-300" />
                )}
              </button>
            );
          })}
        </div>

        <div className="my-5 h-px bg-gray-100" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
              bKash Number
            </label>
            <input
              value={form.bkashNumber}
              onChange={(e) => setForm({ ...form, bkashNumber: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Nagad Number
            </label>
            <input
              value={form.nagadNumber}
              onChange={(e) => setForm({ ...form, nagadNumber: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Rocket Number
            </label>
            <input
              value={form.rocketNumber}
              onChange={(e) => setForm({ ...form, rocketNumber: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
            Payment Instructions
          </label>
          <textarea
            rows={3}
            value={form.paymentInstructions}
            onChange={(e) => setForm({ ...form, paymentInstructions: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-green-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-green-500/30 transition hover:bg-green-600 disabled:opacity-60"
        >
          <Save size={16} />
          {isSaving ? "Saving…" : "Save Global Settings"}
        </button>
      </div>
    </div>
  );
}
