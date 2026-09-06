"use client";

import { ProductSearchProps } from "@/types/next-auth";

export default function ProductSearch({
  search,
  setSearch,
}: ProductSearchProps) {
  return (
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full rounded-xl
          border border-gray-200
          bg-gray-50
          px-4 py-3
          text-sm text-gray-900
          placeholder:text-gray-400
          outline-none
          transition
          focus:border-green-500
          focus:ring-2
          focus:ring-green-500/10
        "
      />
  );
}