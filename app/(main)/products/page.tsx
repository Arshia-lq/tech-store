import ProductsPageClient from "@/components/products/ProductsPageCilent";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Explore <span className="text-green-500">Innovation</span>
        </h1>

        <p className="mt-3 text-gray-500">
          Discover the most advanced technology for your daily lifestyle.
        </p>
      </div>

      <ProductsPageClient />

    </div>
  );
}