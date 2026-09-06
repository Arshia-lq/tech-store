import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import CategoryManager from "./CategoryManager";

export default async function CategoriesPage() {
  await connectDB();

  const categories = await Category.find({}).sort({ name: 1 }).lean();

  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat: any) => {
      const count = await Product.countDocuments({ category: cat._id });
      return {
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon || null,
        parent: cat.parent ? cat.parent.toString() : null,
        productCount: count,
      };
    })
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-600">
            ⚙ Management
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Category <span className="text-gray-400">Inventory</span>
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Organize your store structure and monitor product distribution.
          </p>
        </div>
      </div>

      <CategoryManager initialCategories={categoriesWithCounts} />
    </div>
  );
}
