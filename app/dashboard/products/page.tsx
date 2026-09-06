import connectDB from "@/lib/db";
import Product from "@/models/Product";
import ProductTable, { AddProductButton } from "./ProductTable";

export default async function ProductsAdminPage() {
  await connectDB();

  const products = await Product.find({}).populate("category").sort({ createdAt: -1 }).lean();

  const serialized = products.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    sku: p.sku || "",
    price: p.price,
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
    category: p.category ? { _id: p.category._id.toString(), name: p.category.name } : null,
    stock: p.stock,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Product Inventory
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Manage your catalog, stock levels, and product visibility.
          </p>
        </div>

        <AddProductButton />
      </div>

      <ProductTable products={serialized} />
    </div>
  );
}
