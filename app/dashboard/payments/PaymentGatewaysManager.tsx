"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, CreditCard, ShieldCheck, Zap } from "lucide-react";

const GATEWAYS = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Allow customers to pay upon receipt of goods.",
    icon: Truck,
  },
  {
    value: "stripe",
    label: "Stripe Checkout",
    description: "Secure credit & debit card payments globally.",
    icon: CreditCard,
  },
  {
    value: "sslcommerz",
    label: "SSLCommerz",
    description: "Popular local payment gateway for Bangladesh.",
    icon: ShieldCheck,
  },
];

export default function PaymentGatewaysManager({
  initialActiveMethods,
}: {
  initialActiveMethods: string[];
}) {
  const router = useRouter();
  const [activeMethods, setActiveMethods] = useState(initialActiveMethods);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(value: string) {
    setError(null);
    setPending(value);

    const isActive = activeMethods.includes(value);
    const next = isActive
      ? activeMethods.filter((m) => m !== value)
      : [...activeMethods, value];

    setActiveMethods(next);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activePaymentMethods: next }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      router.refresh();
    } catch (err: any) {
      setActiveMethods(activeMethods);
      setError(err.message);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {GATEWAYS.map((gateway) => {
          const isActive = activeMethods.includes(gateway.value);
          const Icon = gateway.icon;
          const isPending = pending === gateway.value;

          return (
            <div
              key={gateway.value}
              className={`rounded-3xl border-2 bg-white p-6 shadow-sm transition ${
                isActive ? "border-green-200" : "border-transparent"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  isActive ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={20} />
              </span>

              <h3
                className={`mt-4 text-base font-bold ${
                  isActive ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {gateway.label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {gateway.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wide ${
                    isActive ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {isActive ? "Connected" : "Inactive"}
                </span>

                <button
                  onClick={() => toggle(gateway.value)}
                  disabled={isPending}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${
                    isActive ? "bg-green-500" : "bg-gray-200"
                  }`}
                  aria-label={`Toggle ${gateway.label}`}
                >
                  <span
                    className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-green-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-green-500 shadow-sm">
            <Zap size={18} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Next-Gen Payment Smart Routing
            </h3>
            <p className="mt-0.5 max-w-xl text-xs text-gray-500">
              Our platform automatically routes payments during peak traffic to
              ensure 99.9% uptime for your store.
            </p>
          </div>
        </div>

        <button className="w-fit shrink-0 rounded-xl bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-green-600 shadow-sm hover:bg-gray-50">
          Advanced Config
        </button>
      </div>
    </div>
  );
}
