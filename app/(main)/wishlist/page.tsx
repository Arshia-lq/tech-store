"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, PackageSearch, ShoppingCart, Sparkles, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/app/store/useWishlistStore";
import { useCartStore } from "@/app/store/useCartStore";

export default function WishlistPage() {
  const router = useRouter();

  const items = useWishlistStore((state) => state.items);
  const hasHydrated = useWishlistStore((state) => state.hasHydrated);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  const header = (
    <div className="flex items-center justify-between p-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm transition hover:text-gray-900"
          aria-label="Go back"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            My Wishlist
          </h1>
          <p className="text-sm italic text-gray-400">
            Your personalized collection of tech marvels.
          </p>
        </div>
      </div>

      {hasHydrated && items.length > 0 && (
        <button
          onClick={() => {
            if (window.confirm("Remove all items from your wishlist?")) {
              clearWishlist();
            }
          }}
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50"
        >
          <Trash2 size={15} />
          Clear Favorites
        </button>
      )}
    </div>
  );

  if (!hasHydrated) {
    return <div className="space-y-8">{header}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        {header}

        <div className="flex flex-col items-center justify-center rounded-3xl bg-white/0 py-24 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
            <PackageSearch size={36} />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Browse our collection and save the devices that inspire your
            future workflow.
          </p>
          <Link
            href="/products"
            className="mt-6 flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600"
          >
            <Sparkles size={15} />
            Explore Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {header}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-10">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex justify-end">
              <button
                onClick={() => removeItem(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50"
                aria-label="Remove from wishlist"
              >
                <Heart size={15} fill="currentColor" />
              </button>
            </div>

            <Link href={`/products/${item.id}`}>
              <div className="relative -mt-4 h-44 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="mt-3">
              {item.sku && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-green-600">
                  {item.sku}
                </p>
              )}
              <Link href={`/products/${item.id}`}>
                <h3 className="mt-1 line-clamp-1 text-sm font-bold text-gray-900">
                  {item.name}
                </h3>
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">
                ${item.price.toLocaleString()}
              </p>
              <button
                onClick={() => addToCart(item)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600"
                aria-label="Add to cart"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
