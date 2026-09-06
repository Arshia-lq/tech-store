"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  PackageSearch,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/app/store/useCartStore";

const SHIPPING_FEE = 10;

export default function CartPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal());

  const header = (
    <div className="flex items-center justify-between p-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Your <span className="text-green-500">Cart</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review your selected items and proceed to checkout.
        </p>
      </div>

      {hasHydrated && items.length > 0 && (
        <span className="hidden items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600 sm:inline-flex">
          <Zap size={13} />
          Fast Checkout Available
        </span>
      )}
    </div>
  );

  if (!hasHydrated) {
    return <div className="space-y-8">{header}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        {header}

        <div className="flex flex-col items-center justify-center rounded-3xl py-24 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
            <PackageSearch size={36} />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add a few devices you like and they'll show up here, ready
            for checkout.
          </p>
          <Link
            href="/products"
            className="mt-6 flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600"
          >
            <Sparkles size={15} />
            Explore Store
          </Link>
        </div>
      </div>
    );
  }

  const total = subtotal + SHIPPING_FEE;

  return (
    <div className="space-y-8">
      {header}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2 px-10">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <div className="relative h-full w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex-1">
                <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-600">
                  New Generation
                </span>
                <Link href={`/products/${item.id}`}>
                  <h3 className="mt-1 text-sm font-bold text-gray-900">
                    {item.name}
                  </h3>
                </Link>
                <p className="mt-0.5 text-sm font-bold text-green-600">
                  ${item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrement(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item.id)}
                    disabled={item.stock !== undefined && item.quantity >= item.stock}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 transition hover:text-red-500"
                  aria-label="Remove item"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="my-4 h-px bg-gray-100" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Standard Shipping</span>
              <span className="font-semibold text-gray-900">
                ${SHIPPING_FEE.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="my-4 h-px bg-gray-100" />

          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Total Amount
          </p>
          <p className="mt-1 text-2xl font-extrabold text-green-600">
            ${total.toLocaleString()}
          </p>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-6 w-full rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600"
          >
            Checkout Now
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck size={13} />
            Secure 256-bit SSL Checkout
          </p>
        </div>
      </div>
    </div>
  );
}
