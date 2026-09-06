import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-16 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#0b1220] px-8 py-14 text-center lg:px-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            Ready to Upgrade Your Tech Ecosystem?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Explore thousands of genuine products, custom PC builder options,
            and exclusive deal offers today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Browse All Products
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Contact Customer Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
