import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      image?: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    role: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    image?: string | null;
  }
}

export interface HeroProduct {
  _id: string;
  name: string;
  description: string;
  image?: string;      // legacy field — optional since new products may not have it
  images?: string[];    // current field — optional since old products may not have it

}
type ProductsProps = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page?: number;
  onPageChange?: (page: number) => void;
}

interface ProductSidebarProps {
  filters: ProductFilters;
  setFilter: (
    key: keyof ProductFilters,
    value: string
  ) => void;
}

interface ProductFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  page: number;
}

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  onSubmit: () => void;
}

interface ProductSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

interface CategoriesProps {
  setCategory: (value: string) => void;
  selectedCategory?: string;
  variant?: "default" | "sidebar";
}

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
}
