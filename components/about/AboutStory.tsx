import { Store, CheckCircle2, Rocket, Globe } from "lucide-react";

export default function AboutStory() {
  const checklist = [
    "100% Original Global Warranty",
    "Dedicated Tech Support Staff",
    "Instant Compatibility Check",
    "Flexible Payment & EMI Options",
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <Store size={13} />
            Our Story & Mission
          </span>

          <h2 className="mt-5 text-2xl font-bold leading-tight text-gray-900 lg:text-3xl">
            Driven by Passion, Built for Performance.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Founded in 2024, TechStore started with a clear observation:
            buying genuine high-performance computer hardware and gadgets was
            often confusing, slow, and plagued by market markup.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            We set out to create a modern tech destination where authenticity
            is absolute, customer service is knowledgeable, and delivery is
            lightning fast. Whether you are building a custom gaming beast,
            upgrading your workstation, or looking for everyday audio gear,
            we treat every customer like an innovator.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0 text-green-500" />
                <span className="text-sm font-medium text-gray-800">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#0b1220] p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />

          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
            <Rocket size={20} />
          </div>

          <p className="relative mt-6 text-xl font-semibold leading-snug text-white lg:text-2xl">
            Our goal is not just to sell products, but to inspire
            innovation in every workspace and setup.
          </p>

          <div className="relative mt-10 flex items-end justify-between border-t border-white/10 pt-5">
            <div>
              <p className="text-sm font-semibold text-white">
                TechStore Executive Team
              </p>
              <p className="text-xs text-slate-400">Dhaka Innovation Lab</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-white/10">
              <Globe size={12} />
              Global Standards
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
