"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  User,
  Lock,
  MapPin,
  Heart,
  Monitor,
  Sparkles,
} from "lucide-react";

const TABS = [
  { href: "/account", label: "Dashboard", icon: LayoutGrid },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/profile", label: "Edit Profile", icon: User },
  { href: "/account/profile#password", label: "Password", icon: Lock },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/saved-pc", label: "Saved PC", icon: Monitor },
  { href: "/account/star-points", label: "Star Points", icon: Sparkles },
];


const COMING_SOON_TABS: { label: string; icon: typeof Monitor }[] = [];

export default function AccountTabs() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  function isTabActive(href: string) {
    const [tabPath, tabHash] = href.split("#");

    if (tabPath === "/account") return pathname === "/account";
    if (tabPath === "/account/profile") {
      if (pathname !== "/account/profile") return false;
      
      return tabHash ? hash === `#${tabHash}` : hash !== "#password";
    }
    return pathname.startsWith(tabPath);
  }

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 lg:px-8">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-4 text-xs font-bold uppercase tracking-wide transition ${
              isTabActive(href)
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}

        {COMING_SOON_TABS.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="flex shrink-0 cursor-not-allowed items-center gap-1.5 border-b-2 border-transparent px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-300"
            title="Coming soon"
          >
            <Icon size={14} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
