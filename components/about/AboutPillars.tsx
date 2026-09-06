import { ShieldCheck, Zap, Cpu, Heart } from "lucide-react";

export default function AboutPillars() {
  const pillars = [
    {
      icon: ShieldCheck,
      tag: "Quality First",
      tagColor: "bg-green-50 text-green-600",
      title: "100% Authentic Guarantee",
      description:
        "We source directly from official brand manufacturers and authorized global distributors to guarantee genuine products every time.",
    },
    {
      icon: Zap,
      tag: "Speed & Reliability",
      tagColor: "bg-orange-50 text-orange-500",
      title: "Lightning Express Delivery",
      description:
        "Equipped with automated fulfillment logistics, we ensure same-day dispatch and ultra-fast delivery straight to your doorstep.",
    },
    {
      icon: Cpu,
      tag: "Next-Gen Hardware",
      tagColor: "bg-blue-50 text-blue-500",
      title: "Cutting-Edge Innovation",
      description:
        "From custom enthusiast PC builds to next-gen AI gadgets, we curate the absolute latest tech breakthroughs as soon as they drop.",
    },
    {
      icon: Heart,
      tag: "24/7 Dedicated",
      tagColor: "bg-pink-50 text-pink-500",
      title: "Customer-Centric Care",
      description:
        "Our relationship doesn't end at checkout. Enjoy hassle-free returns, official warranty coverage, and dedicated lifetime support.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
          What Sets Us Apart
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Built on four core pillars that guide every order, customer
          interaction, and product selection.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-800">
                <pillar.icon size={20} />
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${pillar.tagColor}`}
              >
                {pillar.tag}
              </span>
            </div>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
