export default function AboutJourney() {
  const milestones = [
    {
      year: "2024",
      title: "TechStore Launch",
      description:
        "Founded with a vision to redefine e-commerce in Bangladesh by eliminating counterfeit products and delivering transparent pricing.",
    },
    {
      year: "2025",
      title: "Brand Expansion & Hub",
      description:
        "Partnered with over 50 global tech leaders including ASUS, NVIDIA, Apple, and Intel; opened state-of-the-art tech experience hub.",
    },
    {
      year: "2026",
      title: "AI PC Builder & Express Logistics",
      description:
        "Introduced instant custom PC compatibility algorithms, interactive gear comparison, and nationwide same-day shipping.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <div className="rounded-3xl bg-gray-50 p-8 ring-1 ring-gray-100 lg:p-10">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-600">
            Journey
          </span>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 lg:text-3xl">
            Our Journey So Far
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.year}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <p className="text-2xl font-bold text-green-500">
                {milestone.year}
              </p>
              <h3 className="mt-2 text-base font-semibold text-gray-900">
                {milestone.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
