import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import {
  User,
  Sparkles,
  CreditCard,
  ShoppingBag,
  KeyRound,
  MapPin,
  Heart,
  Monitor,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();

  const [totalOrders, recentOrders] = await Promise.all([
    Order.countDocuments({ user: session.user.id }),
    Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  const serializedOrders = recentOrders.map((o: any) => ({
    _id: o._id.toString(),
    shortId: o._id.toString().slice(-8).toUpperCase(),
    totalPrice: o.totalPrice,
    status: o.status,
    createdAt: o.createdAt,
  }));

 
  const starPoints = 250;
  const storeCredit = 0;

  const actionCards = [
    { href: "/account/orders", label: "Orders", description: "View your purchase history", icon: ShoppingBag, color: "bg-blue-50 text-blue-500" },
    { href: "/account/profile", label: "Edit Profile", description: "Manage your personal info", icon: User, color: "bg-green-50 text-green-500" },
    { href: "/account/profile#password", label: "Change Password", description: "Keep your account secure", icon: KeyRound, color: "bg-red-50 text-red-500" },
    { href: "/account/addresses", label: "Addresses", description: "Manage shipping destinations", icon: MapPin, color: "bg-amber-50 text-amber-500" },
    { href: "/wishlist", label: "Wishlist", description: "Your favorite tech items", icon: Heart, color: "bg-pink-50 text-pink-500" },
    { href: "/account/saved-pc", label: "Saved PC", description: "Your custom configurations", icon: Monitor, color: "bg-indigo-50 text-indigo-500" },
    { href: "/account/star-points", label: "Star Points", description: "Check your reward balance", icon: Sparkles, color: "bg-purple-50 text-purple-500" },
    { href: "/account/transactions", label: "Transactions", description: "View all payment history", icon: CreditCard, color: "bg-gray-100 text-gray-500" },
  ];

  function statusPillColor(status: string) {
    if (status === "Cancelled") return "bg-red-50 text-red-500";
    if (status === "Delivered") return "bg-green-50 text-green-600";
    return "bg-amber-50 text-amber-600";
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <User size={32} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Account Hub
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">
              {session.user.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="rounded-2xl border border-gray-100 px-5 py-3 text-center">
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <Sparkles size={15} />
            </span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Star Points
            </p>
            <p className="text-lg font-bold text-gray-900">{starPoints}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 px-5 py-3 text-center">
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-500">
              <CreditCard size={15} />
            </span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Store Credit
            </p>
            <p className="text-lg font-bold text-gray-900">৳{storeCredit}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 px-5 py-3 text-center">
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
              <ShoppingBag size={15} />
            </span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Total Orders
            </p>
            <p className="text-lg font-bold text-gray-900">{totalOrders}</p>
          </div>
        </div>
      </div>

      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {actionCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
          >
            <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}>
              <card.icon size={24} />
            </span>
            <h3 className="mt-4 text-base font-bold text-gray-900">
              {card.label}
            </h3>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              {card.description}
            </p>
          </Link>
        ))}

        <LogoutButton />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShoppingBag size={16} />
            </span>
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-bold uppercase tracking-wide text-green-600 hover:text-green-700"
          >
            View All History
          </Link>
        </div>

        <div className="mt-5 h-px bg-gray-100" />

        <div className="mt-5 space-y-3">
          {serializedOrders.length === 0 ? (
            <p className="text-sm text-gray-400">You haven&apos;t placed any orders yet.</p>
          ) : (
            serializedOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4"
              >
                <div>
                  <p className="text-xs text-gray-400">#{order.shortId}</p>
                  <p className="text-sm font-bold text-gray-900">
                    Order #{order.shortId}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    ৳{order.totalPrice.toLocaleString()}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusPillColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
