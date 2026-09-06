"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Store,
  Home,
  LayoutDashboard,
  Users,
  Grid2X2,
  Package,
  Zap,
  ShoppingCart,
  Heart,
  Settings,
  CreditCard,
  User,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/categories", label: "Categories", icon: Grid2X2 },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/banner", label: "Banner", icon: Zap },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/wishlist", label: "My Wishlist", icon: Heart },
  { href: "/dashboard/settings", label: "Site Settings", icon: Settings },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-gray-100 bg-white transition-all ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white">
            <Store size={18} />
          </span>
          {!collapsed && (
            <span className="text-lg font-bold text-green-500">TechStore</span>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mb-2 text-gray-400 hover:text-gray-600"
          aria-label="Expand sidebar"
        >
          <ChevronLeft size={16} className="rotate-180" />
        </button>
      )}

      <Link
        href="/"
        className="mx-4 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
      >
        <Home size={17} />
        {!collapsed && "Back to Shop"}
      </Link>

      <div className="mx-4 mb-2 h-px bg-gray-100" />

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-green-500 text-white shadow-sm shadow-green-500/30"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={17} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-6 mt-2 border-t border-gray-100 pt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={17} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
