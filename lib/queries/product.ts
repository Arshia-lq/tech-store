import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function fetchProduct(id: string) {
  await connectDB();

  void Category;

  const product = await Product.findById(id).populate("category").lean();
  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}
