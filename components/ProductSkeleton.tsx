import Skeleton from "./Skeleton";

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="relative h-56 w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/4" />
    </div>
  );
}

export default function ProductsSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
