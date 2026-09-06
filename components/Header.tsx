"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Store,
  Home,
  Grid2X2,
  Info,
  Phone,
  CircleHelp,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import HeaderSearch from "./HeaderSearch";
import UserMenu from "./UserMenu";
import { useCartStore } from "@/app/store/useCartStore";
import { useWishlistStore } from "@/app/store/useWishlistStore";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  const cartCount = useCartStore((state) =>
    state.hasHydrated ? state.items.length : 0
  );
  const wishlistCount = useWishlistStore((state) =>
    state.hasHydrated ? state.items.length : 0
  );

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Collection", icon: Grid2X2 },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/contact", label: "Contact Us", icon: Phone },
    { href: "/support", label: "Support", icon: CircleHelp },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="h-5 bg-[#5b4335]" />

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center px-6">
          <Link href="/" className="mr-6 flex items-center gap-2 lg:mr-10">
             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white">
              <Store className="h-5 w-5 text-white"/>
            </div>
            <div className="text-lg font-bold">
            <span className="text-green-500">
              Tech
            </span>
            <span className="text-black">Store</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-green-500"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:gap-5">
            <div className="hidden w-40 items-center gap-2 rounded-full bg-gray-50 px-4 py-2 md:flex lg:w-52">
              <Search size={16} className="text-gray-400" />
              <HeaderSearch />
            </div>

            <Link href="/wishlist" className="relative text-gray-500 hover:text-green-500">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative text-gray-500 hover:text-green-500">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {status === "authenticated" ? (
              <UserMenu />
            ) : status === "loading" ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                <UserRound size={16} />
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="text-gray-600 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 lg:hidden">
            <div className="mb-4 flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 md:hidden">
              <Search size={16} className="text-gray-400" />
              <HeaderSearch />
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-500"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
