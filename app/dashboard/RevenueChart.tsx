"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

const days = ["THU", "FRI", "SAT", "SUN", "MON", "TUE", "WED"];

export default function RevenueChart() {
  const [range, setRange] = useState<"daily" | "monthly">("daily");

  const bars = [20, 35, 28, 42, 30, 50, 65];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Revenue Stream</h2>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Real-Time Acquisition Metrics
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-1">
          <button
            onClick={() => setRange("daily")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
              range === "daily"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setRange("monthly")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
              range === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400"
            }`}
          >
            Monthly
            <TrendingUp size={12} className="text-green-500" />
          </button>
        </div>
      </div>

      <div className="mt-8 flex h-64 items-end justify-between gap-3">
        {bars.map((height, i) => (
          <div key={days[i]} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full rounded-t-lg transition-all ${
                i === bars.length - 1 ? "bg-green-500" : "bg-gray-100"
              }`}
              style={{ height: `${height * 3}px` }}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-wide ${
                i === bars.length - 1 ? "text-green-600" : "text-gray-300"
              }`}
            >
              {days[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
