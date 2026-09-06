"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronRight,
  FileText,
  Heart,
  ListChecks,
  MessageSquare,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useCartStore } from "@/app/store/useCartStore";
import { useWishlistStore } from "@/app/store/useWishlistStore";

interface SpecRow {
  label: string;
  value: string;
}

interface SpecSection {
  title: string;
  rows: SpecRow[];
}

type Tab = "specification" | "description" | "reviews";

function parseSpecSections(raw?: string): SpecSection[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (s) => typeof s?.title === "string" && Array.isArray(s?.rows)
      )
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function ProductDetail({ product }: { product: any }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const images: string[] =
    product.images?.length > 0 ? product.images : product.image ? [product.image] : [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const tabsRef = useRef<HTMLDivElement>(null);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const wishlistHydrated = useWishlistStore((state) => state.hasHydrated);

  const inWishlist = wishlistHydrated && isInWishlist(product._id);
  const inStock = (product.stock ?? 0) > 0;
  const hasDiscount = product.regularPrice && product.regularPrice > product.price;
  const savings = hasDiscount ? product.regularPrice - product.price : 0;

  const specSections = useMemo(
    () => parseSpecSections(product.specifications),
    [product.specifications]
  );

  const reviews = product.reviews ?? [];
  const numReviews = product.numReviews ?? reviews.length;
  const avgRating = product.avgRating ?? 0;

  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r: any) => {
      const idx = Math.min(Math.max(Math.round(r.rating), 1), 5) - 1;
      counts[idx] += 1;
    });
    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star - 1];
      const pct = numReviews > 0 ? (count / numReviews) * 100 : 0;
      return { star, count, pct };
    });
  }, [reviews, numReviews]);

  function cartItem() {
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      image: images[0],
      sku: product.sku,
      stock: product.stock,
    };
  }

  function handleAddToCart() {
    addToCart(cartItem(), quantity);
  }

  function handleBuyNow() {
    addToCart(cartItem(), quantity);
    router.push("/checkout");
  }

  function goToSpecs() {
    setActiveTab("specification");
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmitReview() {
    setReviewError(null);

    if (reviewRating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please write a short comment.");
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setReviewSuccess(true);
      setReviewRating(0);
      setReviewComment("");
      router.refresh();
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-600">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-gray-600">Products</Link>
        {product.category?.name && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/products?category=${product.category._id}`}
              className="hover:text-gray-600"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-700">{product.name}</span>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="relative h-80 w-full sm:h-96">
              {images[selectedImage] && (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-50 transition ${
                      i === selectedImage ? "border-green-500" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                Price: ৳{product.price?.toLocaleString()}
              </span>
              <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                Stock:{" "}
                <span className={inStock ? "text-green-600" : "text-red-500"}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </span>
              {product.sku && (
                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                  Code: {product.sku}
                </span>
              )}
              {product.brand && (
                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                  Brand: {product.brand}
                </span>
              )}
            </div>

            {product.keyFeatures?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Key Features
                </h2>
                <div className="mt-1 h-0.5 w-8 bg-green-500" />
                <ul className="mt-3 space-y-1.5">
                  {product.keyFeatures.map((f: SpecRow, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                      <span>
                        <span className="font-semibold text-gray-900">{f.label}:</span>{" "}
                        {f.value}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={goToSpecs}
                  className="mt-2 text-xs font-semibold text-red-500 hover:underline"
                >
                  View More Info
                </button>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="relative flex-1 rounded-2xl bg-green-50 p-4">
                {hasDiscount && (
                  <span className="absolute -top-2 right-3 rounded-full bg-purple-600 px-2.5 py-1 text-[10px] font-bold text-white">
                    Save: ৳{savings.toLocaleString()}
                  </span>
                )}
                <p className="text-2xl font-extrabold text-red-500">
                  ৳{product.price?.toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-gray-500">Special Price</p>
              </div>

              {hasDiscount && (
                <div className="flex-1 rounded-2xl bg-gray-50 p-4">
                  <p className="text-2xl font-extrabold text-gray-400">
                    ৳{product.regularPrice.toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold text-gray-400">Regular Price</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-11 items-center justify-center text-gray-500 hover:text-gray-900"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center text-sm font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      product.stock ? Math.min(product.stock, q + 1) : q + 1
                    )
                  }
                  className="flex h-12 w-11 items-center justify-center text-gray-500 hover:text-gray-900"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="h-12 flex-1 min-w-[140px] rounded-xl bg-green-500 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="h-12 flex-1 min-w-[140px] rounded-xl border-2 border-green-500 text-sm font-bold uppercase tracking-wide text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(cartItem())}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
                  inWishlist
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:text-red-500"
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={tabsRef} className="flex justify-center">
        <div className="inline-flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm">
          {[
            { id: "specification" as Tab, label: "Specification", icon: ListChecks },
            { id: "description" as Tab, label: "Description", icon: FileText },
            { id: "reviews" as Tab, label: "Reviews", icon: MessageSquare },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                activeTab === id
                  ? "bg-red-500 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "specification" && (
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            Technical <span className="text-green-500">Specifications</span>
          </h2>

          {specSections ? (
            <div className="mt-6 space-y-8">
              {specSections.map((section, si) => (
                <div key={si}>
                  <div className="rounded-lg bg-green-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-green-700">
                    {section.title}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {section.rows.map((row, ri) => (
                      <div
                        key={ri}
                        className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4"
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          {row.label}
                        </p>
                        <p className="text-sm text-gray-700 sm:col-span-2">
                          {row.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : product.specifications ? (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {product.specifications}
            </p>
          ) : (
            <p className="mt-6 text-sm text-gray-400">
              No specifications have been added for this product yet.
            </p>
          )}
        </div>
      )}

      {activeTab === "description" && (
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            Product <span className="text-green-500">Description</span>
          </h2>
          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-4xl font-extrabold text-gray-900">
                    {avgRating.toFixed(1)}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                    Global Rating
                  </p>
                </div>
                <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  {numReviews} Verification{numReviews === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {ratingBreakdown.map(({ star, pct }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-2 text-xs font-semibold text-gray-500">
                      {star}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-[11px] text-gray-400">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-500">
                  <MessageSquare size={16} />
                </span>
                <h3 className="text-sm font-bold text-gray-900">Post Analysis</h3>
              </div>

              {status !== "authenticated" ? (
                <p className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  <Link href="/login" className="font-semibold text-green-600 hover:underline">
                    Sign in
                  </Link>{" "}
                  to leave a review.
                </p>
              ) : reviewSuccess ? (
                <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                  Thanks — your review has been posted.
                </p>
              ) : (
                <>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Rating Scale
                  </p>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                          star <= reviewRating
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-300 hover:bg-gray-200"
                        }`}
                        aria-label={`${star} star`}
                      >
                        <Star size={16} fill="currentColor" />
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Narrative Transcription
                  </p>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Synthesize your experience here..."
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />

                  {reviewError && (
                    <p className="mt-2 text-xs font-semibold text-red-500">{reviewError}</p>
                  )}

                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewSubmitting}
                    className="mt-4 w-full rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
                  >
                    {reviewSubmitting ? "Submitting…" : "Submit Review"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Verified Transmissions</h3>
              <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-600">
                {numReviews} Entries
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 py-16 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <MessageSquare size={18} />
                </span>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                  Be the first to synthesize feedback.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {reviews.map((review: any, i: number) => (
                  <div key={i} className="border-b border-gray-50 pb-5 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">{review.name}</p>
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star
                            key={si}
                            size={13}
                            fill={si < review.rating ? "currentColor" : "none"}
                            className={si < review.rating ? "" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1.5 text-sm text-gray-600">{review.comment}</p>
                    <p className="mt-1.5 text-[11px] text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
