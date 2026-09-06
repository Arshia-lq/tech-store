"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, Plus, Eye, Pencil, Trash2 } from "lucide-react";

interface ProductRow {
  _id: string;
  name: string;
  sku: string;
  price: number;
  images: string[];
  category: { _id: string; name: string } | null;
  stock: number;
}

export function AddProductButton() {
  return (
    <Link
      href="/dashboard/products/add"
      className="flex w-fit items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-green-600"
    >
      <Plus size={15} />
      Add New Product
    </Link>
  );
}

function stockColor(stock: number) {
  if (stock === 0) return "text-red-500 bg-red-500";
  if (stock <= 10) return "text-orange-500 bg-orange-500";
  return "text-green-600 bg-green-500";
}

export default function ProductTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(products);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this product? This cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setItems((prev) => prev.filter((p) => p._id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search catalog..."
            className="w-full rounded-xl border border-transparent bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-gray-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50">
            <SlidersHorizontal size={13} />
            Filter
          </button>
          <span className="text-sm font-bold text-gray-700">
            {items.length} Items
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product Info</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Value</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  No products yet.
                </td>
              </tr>
            ) : (
              items.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          SKU-{product.sku || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-md border border-green-100 bg-green-50 px-2 py-1 font-mono text-[10px] font-semibold text-green-600">
                      {product.category?._id.toUpperCase() || "—"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="w-24">
                      <span className={`text-xs font-bold ${stockColor(product.stock).split(" ")[0]}`}>
                        {product.stock}
                      </span>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${stockColor(product.stock).split(" ")[1]}`}
                          style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/products/${product._id}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                        aria-label="View product"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/dashboard/products/edit/${product._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                        aria-label="Edit product"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
