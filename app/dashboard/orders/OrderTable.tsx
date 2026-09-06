"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  X,
  Copy,
  Package,
  Truck,
  CreditCard,
  ChevronDown,
  Clock,
  Loader,
  CheckCircle2,
  XCircle,
  PauseCircle,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRow {
  _id: string;
  shortId: string;
  createdAt: string;
  items: OrderItem[];
  totalPrice: number;
  shippingInfo: {
    name: string;
    phone: string;
    city: string;
    area: string;
    address: string;
    landmark?: string;
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  user: { name: string; email: string } | null;
}

const STATUS_OPTIONS = [
  { value: "Pending", icon: Clock, color: "text-gray-500 bg-gray-100" },
  { value: "Awaiting Payment", icon: Clock, color: "text-red-500 bg-red-50" },
  { value: "Awaiting Review", icon: Eye, color: "text-orange-500 bg-orange-50" },
  { value: "Processing", icon: Loader, color: "text-orange-500 bg-orange-50" },
  { value: "Shipped", icon: Truck, color: "text-blue-500 bg-blue-50" },
  { value: "Delivered", icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  { value: "On Hold", icon: PauseCircle, color: "text-amber-500 bg-amber-50" },
  { value: "Cancelled", icon: XCircle, color: "text-red-500 bg-red-50" },
];

function statusStyle(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

export default function OrderTable({ orders: initialOrders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [openStatusFor, setOpenStatusFor] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All Statuses" || order.status === statusFilter;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.shortId.toLowerCase().includes(q) ||
        order.shippingInfo?.name?.toLowerCase().includes(q) ||
        order.user?.name?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setOpenStatusFor(null);

    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch {
      setOrders(initialOrders);
      alert("Failed to update order status.");
    }
  }

  function customerSubtitle(order: OrderRow) {
    if (order.shippingInfo?.city && order.shippingInfo?.area) {
      return `${order.shippingInfo.city}, ${order.shippingInfo.area}`;
    }
    if (order.user?.email) return order.user.email;
    return "Guest Purchase";
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order ID, Client, or Email..."
              className="w-full rounded-xl border border-transparent bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-gray-200 focus:bg-white"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-xs font-bold text-gray-600 outline-none hover:border-gray-300"
            >
              <option>All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.value}
                </option>
              ))}
            </select>
            <Filter size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
          <Package size={13} className="text-gray-400" />
          {filtered.length} Results Found
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Info</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Economic Value</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Pipeline Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                  No orders match your search.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const style = statusStyle(order.status);
                const Icon = style.icon;

                return (
                  <tr key={order._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-gray-50 px-2 py-1 font-mono text-xs font-bold text-gray-600">
                          #{order.shortId}
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(order.shortId)}
                          className="text-gray-300 hover:text-gray-500"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">
                        {order.shippingInfo?.name || order.user?.name || "Guest"}
                      </p>
                      <p className="text-[11px] uppercase text-gray-400">
                        {customerSubtitle(order)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">
                        ৳{order.totalPrice.toLocaleString()}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                        <CreditCard size={9} />
                        {order.paymentMethod.toUpperCase()} • {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenStatusFor(openStatusFor === order._id ? null : order._id)
                            }
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${style.color}`}
                          >
                            <Icon size={12} />
                            {order.status}
                            <ChevronDown size={11} />
                          </button>

                          {openStatusFor === order._id && (
                            <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-gray-100">
                              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Advance Pipeline State
                              </p>
                              {STATUS_OPTIONS.map((s) => (
                                <button
                                  key={s.value}
                                  onClick={() => updateStatus(order._id, s.value)}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                  <s.icon size={14} className="text-gray-400" />
                                  {s.value}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                          aria-label="View order details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 bg-green-500" />

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                  <p className="text-xs text-gray-400">#{selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
                  <Package size={13} />
                  Items Purchased
                </h3>
                <div className="mt-3 h-px bg-gray-100" />

                <div className="mt-3 space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-500">
                          {item.name.charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-green-600">
                        ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
                    <Truck size={13} />
                    Shipping Info
                  </h3>
                  <div className="mt-3 h-px bg-gray-100" />
                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    {selectedOrder.shippingInfo?.name}
                  </p>
                  <p className="text-xs text-gray-500">{selectedOrder.shippingInfo?.phone}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedOrder.shippingInfo?.address}
                  </p>
                  {selectedOrder.shippingInfo?.landmark && (
                    <p className="text-xs text-gray-400">
                      {selectedOrder.shippingInfo.landmark}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
                    <CreditCard size={13} />
                    Payment Method
                  </h3>
                  <div className="mt-3 h-px bg-gray-100" />
                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    {selectedOrder.paymentMethod.toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    STATUS: <span className="font-semibold">{selectedOrder.paymentStatus}</span>
                  </p>
                  {selectedOrder.transactionId && (
                    <p className="mt-1 text-xs text-gray-400">
                      TXN: {selectedOrder.transactionId}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-900 px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Grand Total
                  </p>
                  <p className="text-xl font-bold text-white">
                    ৳{selectedOrder.totalPrice.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${statusStyle(selectedOrder.status).color}`}
                >
                  Status • {selectedOrder.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
