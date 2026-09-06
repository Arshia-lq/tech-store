import Categories from "@/components/Categories";
import PriceFilter from "./PriceFilter";
import ProductSearch from "./PorductSearch";
import { ProductSidebarProps } from "@/types/next-auth";

export default function ProductSidebar({
  filters,
  setFilter,
}: ProductSidebarProps) {
  return (
    <aside className="w-full lg:w-70">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="border-b border-gray-100 pb-6">
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-gray-900">
            SEARCH
          </h3>

          <ProductSearch
            search={filters.search}
            setSearch={(value) => setFilter("search", value)}
          />
        </div>

        <div className="pt-6">
          <Categories
            setCategory={(value) => setFilter("category", value)}
            variant="sidebar"
          />

          <PriceFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            setMinPrice={(value) => setFilter("minPrice", value)}
            setMaxPrice={(value) => setFilter("maxPrice", value)}
          />
        </div>

      </div>
    </aside>
  );
}