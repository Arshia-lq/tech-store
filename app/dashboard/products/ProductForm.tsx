"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Package,
  Tag,
  Layers,
  ImagePlus,
  Plus,
  X,
} from "lucide-react";

interface CategoryOption {
  _id: string;
  name: string;
}

interface ProductFormValues {
  _id?: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  regularPrice: string;
  category: string;
  stock: string;
  images: string[];
  sku: string;
}

const emptyValues: ProductFormValues = {
  name: "",
  brand: "",
  description: "",
  price: "",
  regularPrice: "",
  category: "",
  stock: "",
  images: [],
  sku: "",
};

export default function ProductForm({
  categories,
  initialValues,
}: {
  categories: CategoryOption[];
  initialValues?: ProductFormValues;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?._id);

  const [form, setForm] = useState<ProductFormValues>(initialValues || emptyValues);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function addImage() {
    if (!newImageUrl.trim() || form.images.length >= 5) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl("");
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handlePublish() {
    setError(null);

    if (!form.name || !form.price || !form.category) {
      setError("Name, price, and category are required.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: form.name,
      brand: form.brand || undefined,
      description: form.description,
      price: Number(form.price),
      regularPrice: form.regularPrice ? Number(form.regularPrice) : undefined,
      category: form.category,
      stock: Number(form.stock) || 0,
      images: form.images,
      sku: form.sku || undefined,
    };

    try {
      const url = isEditing ? `/api/products/${initialValues!._id}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft size={13} />
            Back to Inventory
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>
        </div>

        <button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="flex w-fit items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-green-600 disabled:opacity-60"
        >
          <Plus size={15} />
          {isSubmitting ? "Publishing…" : "Publish Product"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Package size={16} className="text-green-500" />
              Product Information
            </h2>
            <div className="my-4 h-px bg-gray-100" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Product Name
                </label>
                <input
                  placeholder="e.g. MacBook Pro 14"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Brand
                </label>
                <input
                  placeholder="e.g. Apple"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Detailed product overview..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <ImagePlus size={16} className="text-green-500" />
                Media Assets
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {form.images.length} / 5
              </span>
            </div>
            <div className="my-4 h-px bg-gray-100" />

            <div className="flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl bg-gray-50">
                  <Image src={url} alt="" fill className="object-contain" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}

              {form.images.length < 5 && (
                <div className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 text-gray-300">
                  <ImagePlus size={16} />
                  <span className="text-[9px] font-bold uppercase">Upload</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                placeholder="Paste image URL (e.g. from imgbb)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={addImage}
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold uppercase text-white hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Tag size={16} className="text-green-500" />
              Organization
            </h2>
            <div className="my-4 h-px bg-gray-100" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Special Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Regular Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.regularPrice}
                  onChange={(e) => setForm({ ...form, regularPrice: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Category Selection
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              >
                <option value="">Choose category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                SKU / Code
              </label>
              <input
                placeholder="e.g. MBPRO14"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Layers size={16} className="text-green-500" />
              Stock
            </h2>
            <div className="my-4 h-px bg-gray-100" />

            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Available Units
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
          </div>

          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            <Plus size={16} />
            {isSubmitting ? "Publishing…" : "Publish to Store"}
          </button>
        </div>
      </div>
    </div>
  );
}
