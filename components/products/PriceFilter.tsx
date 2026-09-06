"use client";

import { PriceFilterProps } from "@/types/next-auth";

export default function PriceFilter({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: PriceFilterProps) {
  return (
    <div className="border-t border-gray-100 pt-6">
      <h2 className="mb-4 text-xs font-semibold tracking-widest text-gray-900">
        PRICE RANGE
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="min-price"
            className="text-xs font-medium text-gray-500"
          >
            Min Price
          </label>

          <input
            id="min-price"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="
              w-full
              rounded-xl
              border border-gray-200
              bg-gray-50
              px-3 py-2.5
              text-sm text-gray-900
              placeholder:text-gray-400
              outline-none
              transition
              hover:border-gray-300
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500/10
            "
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="max-price"
            className="text-xs font-medium text-gray-500"
          >
            Max Price
          </label>

          <input
            id="max-price"
            type="number"
            placeholder="50k"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="
              w-full
              rounded-xl
              border border-gray-200
              bg-gray-50
              px-3 py-2.5
              text-sm text-gray-900
              placeholder:text-gray-400
              outline-none
              transition
              hover:border-gray-300
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500/10
            "
          />
        </div>
      </div>
    </div>
  );
}