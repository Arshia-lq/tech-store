"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Search,
  ShieldAlert,
} from "lucide-react";

interface Transaction {
  id: string;
  orderId: string;
  type: string;
  method: string;
  amount: number;
  status: string;
  date: string;
}

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-green-50 text-green-600",
  Pending: "bg-amber-50 text-amber-600",
  Failed: "bg-red-50 text-red-500",
};

export default function TransactionsView({
  transactions,
  totalSpent,
  processing,
}: {
  transactions: Transaction[];
  totalSpent: number;
  processing: number;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  function downloadCsv() {
    const header = ["Transaction ID", "Type", "Method", "Amount", "Status", "Date"];
    const rows = filtered.map((t) => [
      t.id,
      t.type,
      t.method,
      t.amount,
      t.status,
      new Date(t.date).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Financial Overview
          </h1>
          <p className="mt-1 text-sm italic text-gray-500">
            Monitor every transaction within your digital ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setFilterOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm hover:text-gray-900"
              aria-label="Filter"
            >
              <Filter size={16} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-gray-100">
                {["All", "Completed", "Pending", "Failed"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setStatusFilter(option);
                      setFilterOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={downloadCsv}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm shadow-green-500/30 hover:bg-green-600"
            aria-label="Download CSV"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
        <Search size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by transaction ID or type..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-500">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Total Spent
            </p>
            <p className="text-lg font-extrabold text-gray-900">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Clock size={18} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Processing
            </p>
            <p className="text-lg font-extrabold text-gray-900">
              ${processing.toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm"
          title="No refund tracking exists in the schema yet — always $0"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldAlert size={18} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Refunded
            </p>
            <p className="text-lg font-extrabold text-gray-900">$0</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {["Transaction ID", "Type", "Method", "Amount", "Status", "Date", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.orderId} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4 font-bold text-gray-900">#{t.id}</td>
                  <td className="px-6 py-4 text-gray-600">{t.type}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      {t.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        STATUS_STYLES[t.status] || "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/checkout/success/${t.orderId}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-gray-700"
                      aria-label="View order"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
