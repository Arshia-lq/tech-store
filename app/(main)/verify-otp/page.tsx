"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, Mail } from "lucide-react";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const otp = digits.join("");
    if (otp.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setResendMessage(null);
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend code");

      setResendMessage("A new code has been sent to your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
          <ShieldCheck size={26} />
        </span>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900">
          VERIFY EMAIL
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          We've sent a 6-digit code to
          <br />
          <span className="font-bold text-gray-900">{email || "your email"}</span>
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {resendMessage && (
          <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
            {resendMessage}
          </p>
        )}

        <form onSubmit={handleVerify}>
          <div className="mt-6 flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="h-14 w-12 rounded-xl border border-gray-200 bg-gray-50 text-center text-xl font-bold text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 sm:h-16 sm:w-14"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {isSubmitting ? "Verifying…" : "Verify Account"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="my-6 h-px bg-gray-100" />

        <p className="text-xs italic text-gray-400">Didn't receive the code?</p>
        <button
          onClick={handleResend}
          disabled={isResending}
          className="mt-1 flex items-center justify-center gap-1.5 text-sm font-bold italic text-green-600 hover:text-green-700 disabled:opacity-60"
        >
          <Mail size={14} />
          {isResending ? "Sending…" : "Resend New Code"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
