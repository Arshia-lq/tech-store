import Image from "next/image";
import Link from "next/link";

export default function Journal() {
  const articles = [
    {
      tag: "Trends",
      title: "The Future of Spatial Computing",
      image:
        "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=800",
      href: "#",
    },
    {
      tag: "Culture",
      title: "Top 10 Essential Devices for 2024",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
      href: "#",
    },
    {
      tag: "Studio",
      title: "Inside the Munich Design Hub",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800",
      href: "#",
    },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-green-500">
            The Journal
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 lg:text-3xl">
            News You Can <span className="text-green-500">Actually Use.</span>
          </h2>
        </div>

        <Link
          href="/journal"
          className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-gray-500 hover:text-green-500 md:flex"
        >
          Read All Stories ⚡
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.title} href={article.href} className="group">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-green-500">
              {article.tag}
            </p>
            <h3 className="mt-1 text-base font-semibold text-gray-900 group-hover:text-green-600">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
