"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Copy,
  Eye,
  Filter,
  Loader,
  Package,
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  PauseCircle,
} from "lucide-react";

interface OrderRow {
  _id: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingInfo: { name: string; city: string; area: string };
  createdAt: string;
}

const STATUS_STYLES: Record<string, { color: string; icon: any }> = {
  Pending: { color: "text-gray-500 bg-gray-100", icon: Clock },
  "Awaiting Payment": { color: "text-red-500 bg-red-50", icon: Clock },
  "Awaiting Review": { color: "text-orange-500 bg-orange-50", icon: Eye },
  Processing: { color: "text-orange-500 bg-orange-50", icon: Loader },
  Shipped: { color: "text-blue-500 bg-blue-50", icon: Truck },
  Delivered: { color: "text-green-600 bg-green-50", icon: CheckCircle2 },
  "On Hold": { color: "text-amber-500 bg-amber-50", icon: PauseCircle },
  Cancelled: { color: "text-red-500 bg-red-50", icon: XCircle },
};

const STATUS_OPTIONS = Object.keys(STATUS_STYLES);

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [filterOpen, setFilterOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const shortId = order._id.slice(-8).toUpperCase();
      const matchesSearch =
        !search ||
        shortId.toLowerCase().includes(search.toLowerCase()) ||
        order.shippingInfo?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All Statuses" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  function copyId(id: string) {
    navigator.clipboard?.writeText(id.slice(-8).toUpperCase());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm">
        <Package size={140} className="pointer-events-none absolute -right-6 -top-8 text-gray-50" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Live Tracking Active
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
              Purchase History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your technology purchases and view your order history in one place.
            </p>
          </div>

          <Link
            href="/products"
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-green-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-600"
          >
            Shop More
            <ShoppingBag size={15} />
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
            <Search size={16} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order ID or Name..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              <Filter size={15} />
              {statusFilter}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-gray-100">
                {["All Statuses", ...STATUS_OPTIONS].map((option) => (
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
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">
          <Package size={12} />
          {filtered.length} Result{filtered.length === 1 ? "" : "s"} Found
        </p>

        <div className="mt-4 divide-y divide-gray-50">
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-400">Loading your orders…</p>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              No orders match your search.
            </p>
          ) : (
            filtered.map((order) => {
              const shortId = order._id.slice(-8).toUpperCase();
              const style = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
              const StatusIcon = style.icon;

              return (
                <div
                  key={order._id}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-500">
                      #{shortId}
                    </span>
                    <button
                      onClick={() => copyId(order._id)}
                      className="text-gray-300 hover:text-gray-500"
                      aria-label="Copy order ID"
                    >
                      <Copy size={13} />
                    </button>
                    {copiedId === order._id && (
                      <span className="text-[10px] font-semibold text-green-500">Copied</span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 sm:w-32">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="sm:w-48">
                    <p className="text-sm font-bold text-gray-900">
                      ${order.totalPrice?.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      {order.paymentMethod} • {order.paymentStatus}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${style.color}`}
                    >
                      <StatusIcon size={12} />
                      {order.status}
                    </span>
                    <Link
                      href={`/checkout/success/${order._id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-400 transition hover:text-gray-700"
                      aria-label="View order"
                    >
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
