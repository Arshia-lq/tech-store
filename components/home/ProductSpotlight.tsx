import Image from "next/image";
import Link from "next/link";

export default function ProductSpotlight() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="relative h-80 w-full overflow-hidden rounded-3xl bg-slate-100 lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000"
              alt="MacBook Pro M3"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Editor's Weekly Pick
              </p>
              <p className="text-sm font-semibold text-gray-900">
                MacBook Pro M3
              </p>
              <p className="text-sm font-bold text-green-500">$1,499.00</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-green-500">
            Spotlight on Quality
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 lg:text-4xl">
            A Masterpiece <br />
            For Your <span className="text-green-500">Masterpiece.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-gray-500">
            The MacBook Pro M3 isn't just a laptop—it's your new
            creative partner. It is built to handle your heaviest projects
            while staying impossibly cool and quiet.
          </p>

          <div className="mt-8 flex gap-10">
            <div>
              <p className="text-2xl font-bold text-gray-900">22hrs</p>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Battery Life
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">XDR</p>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Retina Display
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-xl bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </section>
  );
}
