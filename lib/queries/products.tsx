export async function fetchProducts(
  category: string,
  minPrice: string,
  maxPrice: string,
  search: string,
  page: number = 1,
  limit: number = 8
) {
  const params = new URLSearchParams();

  if (category !== "All") params.set("category", category);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (search) params.set("search", search);
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}