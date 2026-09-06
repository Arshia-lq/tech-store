import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import OrderTable from "./OrderTable";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const isAdmin = ["super-admin", "admin", "manager"].includes(
    session?.user.role as string
  );

  const orders = isAdmin
    ? await Order.find().populate("user", "name email").sort({ createdAt: -1 }).lean()
    : await Order.find({ user: session?.user.id })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();

  const serialized = orders.map((o: any) => ({
    _id: o._id.toString(),
    shortId: o._id.toString().slice(-8).toUpperCase(),
    createdAt: o.createdAt,
    items: o.items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    totalPrice: o.totalPrice,
    shippingInfo: o.shippingInfo,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    transactionId: o.transactionId || "",
    user: o.user ? { name: o.user.name, email: o.user.email } : null,
  }));

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 text-gray-100">
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
            <path d="M10 90 L60 60 L100 80 L190 20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M160 20 L190 20 L190 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          Live Tracking Active
        </span>
        <h1 className="relative mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Order Management
        </h1>
        <p className="relative mt-1 max-w-xl text-sm font-medium text-gray-500">
          Oversee platform orders, track logistics, and manage fulfillment status in real-time.
        </p>
      </div>

      <OrderTable orders={serialized} />
    </div>
  );
}
