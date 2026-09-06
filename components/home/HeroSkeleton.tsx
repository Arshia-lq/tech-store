import Skeleton from "../Skeleton";

export default function HeroSkeleton() {
  return (
    <section>
      <div>
        <div>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-4 h-4 w-1/2" />
        </div>

        <div className="relative h-100 w-full mt-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
