"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Package,
  Tag,
  Settings,
  ImagePlus,
  Save,
  X,
} from "lucide-react";

interface CategoryOption {
  _id: string;
  name: string;
}

interface EditProductValues {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  regularPrice: string;
  category: string;
  stock: string;
  images: string[];
  modelName: string;
  warranty: string;
  specifications: string;
}

const warrantyOptions = [
  "No Warranty (As per provided info)",
  "6 Months",
  "1 Year",
  "2 Years",
  "3 Years",
  "Lifetime",
];

export default function EditProductForm({
  categories,
  initialValues,
}: {
  categories: CategoryOption[];
  initialValues: EditProductValues;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialValues);
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

  function makePrimary(index: number) {
    setForm((prev) => {
      const images = [...prev.images];
      const [selected] = images.splice(index, 1);
      images.unshift(selected);
      return { ...prev, images };
    });
  }

  async function handleUpdate() {
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
      modelName: form.modelName || undefined,
      warranty: form.warranty || undefined,
      specifications: form.specifications || undefined,
    };

    try {
      const res = await fetch(`/api/products/${form._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      router.push("/dashboard/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/products"
          className="flex w-fit items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={13} />
          Back to Inventory
        </Link>

        <span className="w-fit rounded-full bg-green-50 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-green-600">
          Resource ID: {form._id}
        </span>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Edit Product
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Refine your product's presence and stock availability.
        </p>

        <div className="my-6 h-px bg-gray-100" />

        {error && (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-500">
                <Package size={14} />
                Core Details
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Product Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Brand / Manufacturer
                  </label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Contextual Description
                  </label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-500">
                  <ImagePlus size={14} />
                  Visual Assets
                </h2>
                <span className="text-xs font-bold text-gray-400">
                  {form.images.length} / 5
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {form.images.map((url, i) => (
                  <div key={i} className="group relative">
                    <button
                      type="button"
                      onClick={() => makePrimary(i)}
                      className="relative block h-24 w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <Image src={url} alt="" fill className="object-contain" />
                    </button>

                    {i === 0 ? (
                      <span className="absolute inset-x-0 bottom-0 rounded-b-xl bg-green-500 py-1 text-center text-[9px] font-bold uppercase text-white">
                        Primary
                      </span>
                    ) : (
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                ))}

                {form.images.length < 5 && (
                  <div className="flex h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 text-gray-300">
                    <ImagePlus size={16} />
                    <span className="text-[9px] font-bold uppercase">Add</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
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
            <div>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-500">
                <Tag size={14} />
                Economics & Classification
              </h2>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Special Price
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-bold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Regular Price
                  </label>
                  <input
                    type="number"
                    value={form.regularPrice}
                    onChange={(e) => setForm({ ...form, regularPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-bold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-bold text-green-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Inventory Classification
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                >
                  <option value="">Choose category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-500">
                <Settings size={14} />
                Advanced Specs
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Model Name / Number
                  </label>
                  <input
                    value={form.modelName}
                    onChange={(e) => setForm({ ...form, modelName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Warranty Period
                  </label>
                  <select
                    value={form.warranty}
                    onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  >
                    {warrantyOptions.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Technical Specifications
                  </label>
                  <textarea
                    rows={4}
                    value={form.specifications}
                    onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-500 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-600 disabled:opacity-60"
          >
            <Save size={16} />
            {isSubmitting ? "Updating…" : "Update Product"}
          </button>
          <Link
            href="/dashboard/products"
            className="flex items-center justify-center rounded-full bg-gray-100 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-gray-500 transition hover:bg-gray-200"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
