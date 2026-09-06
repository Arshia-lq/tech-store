"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { fetchProducts } from '@/lib/queries/products'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { ProductsProps } from "@/types/next-auth";
import ProductsSkeleton from "./ProductSkeleton";
import { useCartStore } from "@/app/store/useCartStore"
import { useWishlistStore } from "@/app/store/useWishlistStore"

export default function Products({
  category = "All",
  minPrice = "",
  maxPrice = "",
  search = "",
  page = 1,
  onPageChange,
}: ProductsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", category, minPrice, maxPrice, search, page],
    queryFn: () => fetchProducts(category, minPrice, maxPrice, search, page)
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const wishlistHydrated = useWishlistStore((state) => state.hasHydrated);

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return <ProductsSkeleton />
  }

  if (error) {
    return <p>Failed to load products.</p>
  }

  return (
    <div>
      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
        {products.map((product: any) => {
          const hasDiscount = product.regularPrice && product.regularPrice > product.price;
          const savings = hasDiscount ? product.regularPrice - product.price : 0;
          const inWishlist = wishlistHydrated && isInWishlist(product._id);

          const toCartItem = () => ({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] ?? product.image,
            sku: product.sku,
            stock: product.stock,
          });

          return (
            <div
              key={product._id}
              className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {hasDiscount && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-purple-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                  Save: ${savings.toLocaleString()}
                </span>
              )}

              <button
                onClick={() => toggleWishlist(toCartItem())}
                className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition ${
                  inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={15} fill={inWishlist ? "currentColor" : "none"} />
              </button>

              <Link href={`/products/${product._id}`}>
                <div className="relative h-40 w-full">
                  <Image
                    src={product.images?.[0] ?? product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="mt-3">
                  {product.brand && (
                    <p className="text-[11px] font-medium uppercase tracking-wide text-purple-400">
                      {product.brand}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <h2 className="line-clamp-1 text-sm font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <span className="flex shrink-0 items-center gap-0.5 text-xs text-amber-400">
                      <Star size={12} fill="currentColor" />
                      {product.avgRating?.toFixed(1) ?? "0.0"}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-base font-bold text-red-500">
                    ${product.price.toLocaleString()}
                  </p>
                  {hasDiscount && (
                    <p className="text-xs text-gray-400 line-through">
                      ${product.regularPrice.toLocaleString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => addToCart(toCartItem())}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition hover:bg-green-500 hover:text-white"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${num === page
                  ? "bg-green-500 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
