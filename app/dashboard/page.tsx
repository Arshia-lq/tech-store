import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";
import RevenueChart from "./RevenueChart";

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions);

  const allowedRoles = ["super-admin", "admin", "manager"];
  if (!allowedRoles.includes(session?.user.role as string)) {
    redirect("/");
  }

  await connectDB();

  const [totalUsers, totalProducts, lowStockProducts] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Product.find({}).sort({ stock: 1 }).limit(3).select("name stock"),
  ]);

  const totalOrders = 0;
  const totalRevenue = 0;
  const recentOrders: { id: string; customer: string; amount: number }[] = [];

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "+12%",
      icon: Users,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      label: "Market Orders",
      value: totalOrders.toLocaleString(),
      change: "+5%",
      icon: ShoppingBag,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      label: "Node Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      change: "+18%",
      icon: DollarSign,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      label: "Active Nodes",
      value: totalProducts.toLocaleString(),
      change: "OPTIMAL",
      icon: Package,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            DASHBOARD OVERVIEW
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Welcome back, <span className="text-green-500">{session?.user.name}</span>!
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 text-xs font-bold text-gray-500 shadow-sm sm:px-6 sm:py-3 sm:text-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
          Real-Time Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                <stat.icon size={20} />
              </span>
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-bold text-gray-500">
                {stat.change}
              </span>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-400">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-black text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <RevenueChart />
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Stock Protocol</h2>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Inventory Integrity
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Package size={16} />
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-400">No products yet.</p>
            ) : (
              lowStockProducts.map((product: any) => (
                <div key={product._id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {product.name}
                    </span>
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                      {product.stock} UNITS
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${Math.min(product.stock * 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/dashboard/products"
            className="mt-6 block rounded-xl bg-gray-50 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
          >
            Sync Catalog Integrity
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Stream Protocol</h2>
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-500">
              Live Feed
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400">
                No recent orders yet — connect an Order model to populate this.
              </p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                    <ShoppingBag size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Order #{order.id}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      {order.customer} · ৳{order.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white lg:col-span-2">
          <div className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 text-gray-800">
            <TrendingUp size={180} strokeWidth={1} />
          </div>

          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-green-400">
            <ShoppingBag size={18} />
          </span>

          <h3 className="relative mt-4 text-xl font-bold sm:text-2xl">
            Scaling to New Heights
          </h3>
          <p className="relative mt-2 max-w-md text-sm text-gray-400">
            Your catalog now features{" "}
            <span className="font-semibold text-white">
              {totalProducts} premium nodes
            </span>
            . Digital transformation metrics indicate strong growth.
          </p>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/products"
              className="rounded-xl bg-green-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-green-600"
            >
              Add New Product
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/5"
            >
              Expansion Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
