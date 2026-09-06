"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { useCartStore } from "@/app/store/useCartStore";

const SHIPPING_FEE = 10;

async function fetchSettings() {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

interface ShippingForm {
  name: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  landmark: string;
  addressType: "Home" | "Office";
}

const emptyShipping: ShippingForm = {
  name: "",
  phone: "",
  city: "",
  area: "",
  address: "",
  landmark: "",
  addressType: "Home",
};

const PAYMENT_METHODS = [
  {
    value: "bkash",
    label: "bKash",
    description: "Fast & secure payment",
    icon: Wallet,
  },
  {
    value: "sslcommerz",
    label: "SSLCommerz",
    description: "Pay with cards/netbanking",
    icon: CreditCard,
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay upon arrival",
    icon: Truck,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
  });

  const activeMethods: string[] = settings?.activePaymentMethods?.length
    ? settings.activePaymentMethods
    : ["cod"];

  const availableMethods = PAYMENT_METHODS.filter((m) =>
    activeMethods.includes(m.value)
  );

  const [form, setForm] = useState<ShippingForm>(emptyShipping);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const orderPlacedRef = useRef(false);

  useEffect(() => {
    if (!selectedMethod && availableMethods.length > 0) {
      setSelectedMethod(availableMethods[0].value);
    }
  }, [availableMethods, selectedMethod]);

  useEffect(() => {
    if (session?.user?.name && !form.name) {
      setForm((prev) => ({ ...prev, name: session.user!.name! }));
    }
  }, [session, form.name]);

  useEffect(() => {
    if (orderPlacedRef.current) return;
    if (hasHydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hasHydrated, items.length, router]);

  const total = subtotal + SHIPPING_FEE;

  function update<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleConfirm() {
    setError(null);

    if (!form.name || !form.phone || !form.city || !form.area || !form.address) {
      setError("Please fill in all required shipping fields.");
      return;
    }
    if (!selectedMethod) {
      setError("Please select a payment method.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: total,
          shippingInfo: form,
          paymentMethod: selectedMethod,
          paymentStatus: "Pending",
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.message || "Failed to place order");

      orderPlacedRef.current = true;
      clearCart();

      if (selectedMethod === "bkash") {
        router.push(`/checkout/payment/${order._id}`);
      } else {
        router.push(`/checkout/success/${order._id}`);
      }
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (!hasHydrated || items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-6 py-10 lg:px-8 lg:py-14">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete your order details below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">     
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-500">
                <Truck size={18} />
              </span>
              <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Alexander Pierce"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="e.g. 01712345678"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  City / Region
                </label>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="e.g. Dhaka"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Area / Sub-district
                </label>
                <input
                  value={form.area}
                  onChange={(e) => update("area", e.target.value)}
                  placeholder="e.g. Dhanmondi"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  House / Street / Building
                </label>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="e.g. House 12, Road 4, Sector 7"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Landmark
                </label>
                <input
                  value={form.landmark}
                  onChange={(e) => update("landmark", e.target.value)}
                  placeholder="e.g. Beside City Hospital"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {(["Home", "Office"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("addressType", type)}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
                        form.addressType === type
                          ? "bg-green-500 text-white"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-500">
                <CreditCard size={18} />
              </span>
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availableMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.value;
                const isFullWidth = method.value === "cod";

                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setSelectedMethod(method.value)}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                      isFullWidth ? "sm:col-span-2" : ""
                    } ${
                      isSelected
                        ? "border-green-500 bg-green-50/40"
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm">
                      <Icon size={18} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-gray-900">
                        {method.label}
                      </span>
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {method.description}
                      </span>
                    </span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-green-500" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Placing order…"
                : `Confirm Payment • $${total.toLocaleString()}`}
            </button>
          </div>
        </div>

        <div className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="my-4 h-px bg-gray-100" />

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs font-semibold text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="my-4 h-px bg-gray-100" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold text-gray-900">
                ${SHIPPING_FEE.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="my-4 h-px border-t border-dashed border-gray-200" />

          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Total Payable
          </p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            ${total.toLocaleString()}
          </p>

          <div className="mt-5 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              Reliable Delivery
              <Truck size={13} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
