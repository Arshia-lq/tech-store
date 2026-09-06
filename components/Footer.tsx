import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Github,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Store,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#0b1220] text-slate-300">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-[150px]" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
                <Store className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-semibold text-white">
                Tech<span className="text-emerald-400">Store</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Empowering your digital lifestyle with high-performance
              hardware and futuristic innovation. Your trusted partner in
              tech excellence since 2024.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-emerald-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-white">
              CATALOG
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Smartphones",
                "Laptops",
                "Accessories",
                "Tablets",
                "Audio Systems",
                "Gaming Gear",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/products"
                    className="text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-white">
              NAVIGATION & SUPPORT
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 transition-colors hover:text-emerald-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 transition-colors hover:text-emerald-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-slate-400 transition-colors hover:text-emerald-400">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 transition-colors hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 transition-colors hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-slate-400 transition-colors hover:text-emerald-400">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-white">
              STAY AHEAD
            </h3>
            <p className="mt-5 text-sm text-slate-400">
              Subscribe to receive early-bird tech deals and innovation
              updates.
            </p>
            <div className="mt-4 flex overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
              <input
                type="email"
                placeholder="tech@example.com"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button className="whitespace-nowrap bg-emerald-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 text-xs tracking-wide text-slate-400 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span>DHAKA, BANGLADESH · GLOBAL HUB</span>
          </div>
          <div className="flex items-center gap-2 md:justify-center">
            <Mail className="h-4 w-4 text-emerald-400" />
            <span>SUPPORT@TECHSTORE.IO</span>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <Phone className="h-4 w-4 text-emerald-400" />
            <span>+880 1234-TECH-00</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Techstore Innovation Lab. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="transition-colors hover:text-emerald-400">
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors hover:text-emerald-400">
              Terms of Service
            </a>
            <a href="/cookies" className="transition-colors hover:text-emerald-400">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      <a
        href="#"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" fill="white" />
      </a>
    </footer>
  );
};
