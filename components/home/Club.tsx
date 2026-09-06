export default function Club() {
  const stats = [
    { value: "125k+", label: "Our Members" },
    { value: "12/mo", label: "Tech Events" },
    { value: "2.4M", label: "Points Earned" },
    { value: "48+", label: "Partner Brands" },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#0b1220] px-8 py-14 lg:px-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-400 ring-1 ring-white/10">
              ✦ The TechStore Club
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-white lg:text-4xl">
              Get Perks Just For <br />
              <span className="text-emerald-400">Being You.</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Join our community to get 15% off on your birthday, early
              access to new drops, and invites to our exclusive tech
              meetups.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
                JOIN THE CLUB
              </button>
              <button className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
                MEMBER BENEFITS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/5 px-6 py-6 text-center ring-1 ring-white/10"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
