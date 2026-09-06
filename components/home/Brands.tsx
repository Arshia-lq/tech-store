"use client";

import { Smartphone, Headphones, Cpu, Monitor, Laptop } from "lucide-react";

const brands = [
  { name: "APPLE", icon: Smartphone },
  { name: "SAMSUNG", icon: Smartphone },
  { name: "SONY", icon: Headphones },
  { name: "NVIDIA", icon: Cpu },
  { name: "LG", icon: Monitor },
  { name: "DELL", icon: Laptop },
];

export const BrandSection = () => {
  return (
    <section className="border-y border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 lg:px-8">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Global Fleet
        </span>

        {brands.map(({ name, icon: Icon }) => (
          <span
            key={name}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:text-gray-600"
          >
            <Icon size={16} strokeWidth={1.75} />
            {name}
          </span>
        ))}
      </div>
    </section>
  );
};
