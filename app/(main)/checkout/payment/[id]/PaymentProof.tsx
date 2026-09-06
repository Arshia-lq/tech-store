"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ShieldCheck, Zap, Info, Check } from "lucide-react";

export default function PaymentProof({
  order,
  bkashNumber,
  paymentInstructions,
}: {
  order: any;
  bkashNumber: string;
  paymentInstructions: string;
}) {
  const router = useRouter();
  const orderCode = order._id.slice(-8).toUpperCase();

  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const alreadySubmitted = order.status !== "Awaiting Payment";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bkashNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      
    }
  }

  async function handleVerify() {
    setError(null);

    if (!transactionId.trim()) {
      setError("Please enter your transaction ID.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          status: "Awaiting Review",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit proof");

      router.push(`/checkout/success/${order._id}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="h-1.5 bg-green-500" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Complete Payment
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <ShieldCheck size={13} />
                Order #{orderCode}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Total
              </p>
              <p className="text-xl font-extrabold text-green-600">
                ${order.totalPrice?.toLocaleString()}
              </p>
            </div>
          </div>

          {alreadySubmitted ? (
            <div className="mt-6 rounded-2xl bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
              Payment proof already submitted — this order is {order.status.toLowerCase()}.
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-2xl bg-green-50/60 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-green-700">
                    <Zap size={15} />
                    Payment Instructions
                  </h2>
                  <span className="flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-[10px] font-bold text-white">
                    <ShieldCheck size={11} />
                    bKash Secure
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600">{paymentInstructions}</p>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      bKash Merchant Number
                    </p>
                    <p className="mt-0.5 text-xl font-extrabold text-gray-900">
                      {bkashNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-100"
                  >
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy Number"}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">
                  <Info size={12} />
                  Transaction ID
                </label>
                <input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="TRX123456789"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Example: A1B2C3D4 (find this in your SMS confirmation)
                </p>
              </div>

              {error && (
                <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                onClick={handleVerify}
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={16} />
                {submitting ? "Verifying…" : "Verify Payment Proof"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
