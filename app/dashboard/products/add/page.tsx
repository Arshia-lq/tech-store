import connectDB from "@/lib/db";
import Category from "@/models/Category";
import ProductForm from "../ProductForm";

export default async function AddProductPage() {
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  const serializedCategories = categories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
  }));

  return <ProductForm categories={serializedCategories} />;
}
