import Link from "next/link";
import { Sparkles, ArrowRight, Users, ShieldCheck, Award, Headphones } from "lucide-react";

export default function AboutHero() {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      title: "Happy Customers",
      description: "Satisfied tech enthusiasts worldwide",
    },
    {
      icon: ShieldCheck,
      value: "99.8%",
      title: "Product Satisfaction",
      description: "Rigorous quality testing & genuine products",
    },
    {
      icon: Award,
      value: "120+",
      title: "Official Brand Partners",
      description: "Direct partnerships with global tech giants",
    },
    {
      icon: Headphones,
      value: "24/7",
      title: "Support Resolution",
      description: "Expert technical setup and care",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-white">
      <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-green-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-6 pt-16 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-600 ring-1 ring-green-100">
            <Sparkles size={14} />
            Pioneering Next-Gen Tech Retail
          </span>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-gray-900 lg:text-5xl">
            Empowering Your{" "}
            <span className="text-green-500">Digital Evolution</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 lg:text-base">
            TechStore bridges the gap between human creativity and
            revolutionary technology. We provide authentic hardware, custom
            enthusiast rigs, and seamless digital shopping.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 border-t border-gray-100 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <stat.icon size={20} />
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {stat.title}
              </p>
              <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
