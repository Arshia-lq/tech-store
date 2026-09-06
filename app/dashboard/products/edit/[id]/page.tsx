import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { notFound } from "next/navigation";
import EditProductForm from "../EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const [product, categories] = await Promise.all([
    Product.findById(id).lean(),
    Category.find({}).sort({ name: 1 }).lean(),
  ]);

  if (!product) notFound();

  const p = product as any;

  const initialValues = {
    _id: p._id.toString(),
    name: p.name,
    brand: p.brand || "",
    description: p.description,
    price: String(p.price),
    regularPrice: p.regularPrice ? String(p.regularPrice) : "",
    category: p.category ? p.category.toString() : "",
    stock: String(p.stock),
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
    modelName: p.modelName || "",
    warranty: p.warranty || "No Warranty (As per provided info)",
    specifications: p.specifications || "",
  };

  const serializedCategories = categories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
  }));

  return <EditProductForm categories={serializedCategories} initialValues={initialValues} />;
}
