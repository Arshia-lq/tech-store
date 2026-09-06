import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

const STATUS_COPY: Record<string, string> = {
  Pending: "Your order has been placed and will be confirmed shortly.",
  "Awaiting Payment": "We're waiting on your payment to confirm this order.",
  "Awaiting Review": "We've received your payment proof and it's being reviewed.",
  Processing: "Your order is being prepared.",
};

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) {
    redirect("/");
  }

  const o = order as any;
  const orderCode = o._id.toString().slice(-8).toUpperCase();

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-500">
          <CheckCircle2 size={30} />
        </span>

        <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
          Order Placed!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {STATUS_COPY[o.status] || "Thanks for your order."}
        </p>

        <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Order Number</span>
            <span className="font-bold text-gray-900">#{orderCode}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="flex items-center gap-1.5 font-bold text-orange-500">
              <Clock size={13} />
              {o.status}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-gray-900">
              ${o.totalPrice?.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck size={13} />
          A confirmation has been recorded for {o.shippingInfo?.name}
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-600"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
