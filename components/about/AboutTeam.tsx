import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function AboutTeam() {
  const team = [
    {
      name: "Amdad Islam",
      role: "Founder & Lead Architect",
      bio: "Tech visionary passionate about high-performance computing, user experience, and next-gen retail technology.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Sarah Chen",
      role: "Head of Product Strategy",
      bio: "Former hardware reviewer with 8+ years of experience curating premium gadget ecosystems and consumer tech.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Marcus Vance",
      role: "Lead Hardware Engineer",
      bio: "Specialist in custom liquid-cooled rigs, thermal performance optimization, and workstation benchmark testing.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
          Meet the People Behind TechStore
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Engineers, gamers, and tech architects committed to delivering
          excellence.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {team.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100"
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-green-100">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              {member.name}
            </h3>
            <span className="mt-2 rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-600">
              {member.role}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              {member.bio}
            </p>

            <div className="mt-4 flex items-center gap-4 text-gray-400">
              <a href="#" aria-label={`${member.name} on GitHub`} className="hover:text-green-500">
                <Github size={16} />
              </a>
              <a href="#" aria-label={`${member.name} on LinkedIn`} className="hover:text-green-500">
                <Linkedin size={16} />
              </a>
              <a href="#" aria-label={`${member.name} on Twitter`} className="hover:text-green-500">
                <Twitter size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
