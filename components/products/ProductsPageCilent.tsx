"use client";

import { useEffect, useState } from "react";
import ProductSidebar from "./ProductSidebar";
import Products from "../Products";
import { ProductFilters } from "@/types/next-auth";
import { useSearchParams } from "next/navigation";

export default function ProductsPageClient() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>({
    category: "All",
    minPrice: "",
    maxPrice: "",
    search: searchParams.get("search") ?? "",
    page: parseInt(searchParams.get("page") ?? "1"),
  });

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setFilters((prev) =>
      prev.search === urlSearch ? prev : { ...prev, search: urlSearch, page: 1 }
    );
  }, [searchParams]);

  const setFilter = (
    key: keyof ProductFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 1 } : {}),
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      <ProductSidebar filters={filters} setFilter={setFilter} />

      <main>
        <Products
          category={filters.category}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          search={filters.search}
          page={filters.page}
          onPageChange={(num) => setFilter("page", num)}
        />
      </main>
    </div>
  );
}
