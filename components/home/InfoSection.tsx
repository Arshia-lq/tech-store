export default function InfoSection() {
  const features = [
    {
      title: "Top Laptop Gallery in Bangladesh",
      description:
        "Whether you're looking for a high-performance gaming laptop or a sleek ultrabook for work, we offer the latest models from top brands like HP, Asus, Dell, and Apple. Our collection is curated for durability and power.",
    },
    {
      title: "Premium PC Components",
      description:
        "Build your dream rig with our wide range of processors, motherboards, graphics cards, and storage solutions. We provide genuine components that ensure your system runs at peak performance for years to come.",
    },
    {
      title: "Next-Gen Audio & Gadgets",
      description:
        "Experience superior sound with our premium headphones and speakers. From professional studio gear to portable Bluetooth speakers, we've got something for every audiophile and gadget enthusiast.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="border-l-2 border-green-500 pl-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 lg:p-10">
        <h2 className="text-lg font-bold text-gray-900">
          Leading Computer, Laptop & Gadget Shop in Bangladesh
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          Welcome to our tech store, your one-stop destination for all
          things technology. Since our inception, we have been committed
          to providing our customers with the best quality products at
          the most affordable prices. Whether you are a professional
          gamer, a creative designer, or just a tech enthusiast, we have
          the right gear for you.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          We specialize in{" "}
          <span className="font-semibold text-gray-700">Laptops</span>,{" "}
          <span className="font-semibold text-gray-700">Desktops</span>,{" "}
          <span className="font-semibold text-gray-700">Graphics Cards</span>,
          and{" "}
          <span className="font-semibold text-gray-700">Gaming Peripherals</span>
          . Our after-sales service is what sets us apart, ensuring that
          you have peace of mind with every purchase. Explore our
          flagship collection today and join our growing community of
          satisfied customers.
        </p>
      </div>
    </section>
  );
}
