"use client";

import { fetchCategories } from '@/lib/queries/categories'
import { CategoriesProps } from '@/types/next-auth';
import { useQuery } from '@tanstack/react-query'
import CategoriesSkeleton from './CategoriesSkeleton';
import {
  Sparkles,
  Headphones,
  Laptop,
  MonitorCog,
  Monitor as MonitorIcon,
  Gamepad2,
  Grid2X2,
  Wifi,
  Smartphone,
  LayoutGrid,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  Audio: Headphones,
  "Computer Accessories": LayoutGrid,
  "Computer Hardware": MonitorCog,
  Desktop: MonitorIcon,
  Gadget: Grid2X2,
  "Gaming Console": Gamepad2,
  Laptops: Laptop,
  Monitor: MonitorIcon,
  Networking: Wifi,
  Smartphones: Smartphone,
};

function getCategoryIcon(name: string) {
  return CATEGORY_ICONS[name] ?? Grid2X2;
}

export default function Categories({
  setCategory,
  selectedCategory = "All",
  variant = "default",
}: CategoriesProps) {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  })

  const categories = categoriesData ?? [];

  if (categoriesLoading) {
    return <CategoriesSkeleton variant={variant} />
  }

  if (categoriesError) {
    return <p>Failed to load categories.</p>
  }

  if (variant === "sidebar") {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setCategory("All")}
          className="
          w-full rounded-lg px-3 py-2.5
          text-left text-sm font-medium
          text-gray-900
          transition
          hover:bg-gray-50
        "
        >
          All Products
        </button>

        {categories.map((category: any) => (
          <button
            key={category._id}
            onClick={() => setCategory(category._id)}
            className="
            w-full rounded-lg px-3 py-2.5
            text-left text-sm
            text-gray-600
            transition
            hover:bg-gray-50
            hover:text-gray-900
          "
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 lg:max-w-[1700]">
      <button
        onClick={() => setCategory("All")}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 bg-white px-4 py-6 text-center transition ${
          selectedCategory === "All"
            ? "border-green-500"
            : "border-transparent shadow-sm hover:border-gray-200"
        }`}
      >
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            selectedCategory === "All"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <Sparkles size={20} />
        </span>
        <span className="text-sm font-semibold text-gray-700">All</span>
      </button>

      {categories.map((category: any) => {
        const Icon = getCategoryIcon(category.name);
        const isSelected = selectedCategory === category._id;

        return (
          <button
            key={category._id}
            onClick={() => setCategory(category._id)}
            className={`flex flex-col items-center gap-3 rounded-2xl border-2 bg-white px-4 py-6 text-center transition ${
              isSelected
                ? "border-green-500"
                : "border-transparent shadow-sm hover:border-gray-200"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                isSelected
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Icon size={20} />
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  )
}
