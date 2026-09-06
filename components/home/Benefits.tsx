import { ShoppingBag, ShieldCheck, MessageCircle } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: ShoppingBag,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      title: "Fast. Reliable. Global.",
      description:
        "We ship your gear within 48 hours, wherever you are in the world.",
    },
    {
      icon: ShieldCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      title: "We've Got Your Back",
      description:
        "Enjoy a full year of hassle-free replacements. No questions asked.",
    },
    {
      icon: MessageCircle,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      title: "Here to Help, 24/7",
      description:
        "Got a question? Our tech experts are ready to help you anytime, day or night.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:px-20">
      {benefits.map((benefit) => (
        <div
          key={benefit.title}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${benefit.iconBg}`}
          >
            <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            {benefit.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {benefit.description}
          </p>
        </div>
      ))}
    </div>
  );
}
