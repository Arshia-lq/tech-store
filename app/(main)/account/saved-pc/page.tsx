"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Monitor, Zap, Cpu, Layers, Activity, ArrowRight } from "lucide-react";
import AccountTabs from "../AccountTabs";

export default function SavedPcPage() {
  const router = useRouter();

  return (
    <div>
      <AccountTabs />

      <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <Monitor size={28} />
          </span>

          <span className="mx-auto mt-6 flex w-fit items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500 ring-1 ring-gray-100">
            <Zap size={12} className="text-amber-400" />
            Advanced Module
          </span>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Saved PC <br />
            <span className="text-green-500">Configurations</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            Your master builds are currently being synchronized with our
            high-performance cloud servers. This module will be live
            shortly.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 px-4 py-5 text-center">
              <Cpu size={20} className="mx-auto text-indigo-500" />
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Spec Tracking
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-5 text-center">
              <Layers size={20} className="mx-auto text-green-500" />
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Component Sync
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-5 text-center">
              <Activity size={20} className="mx-auto text-red-500" />
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                FPS Analytics
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => router.back()}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
            >
              Go Back
            </button>
            <Link
              href="/support"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold uppercase tracking-wide text-gray-500 transition hover:bg-gray-200"
            >
              Get Notified
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
