export async function fetchCategories() {
  const response = await fetch("/api/categories");

  if(!response.ok){
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}