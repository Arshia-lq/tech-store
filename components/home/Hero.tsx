"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Zap } from "lucide-react";
import HeroSkeleton from "./HeroSkeleton";

interface HeroSlide {
  badge: string;
  headlinePrimary: string;
  headlineSecondary: string;
  description: string;
  image: string;
}

async function fetchSettings() {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSettings,
  });


  const slides: HeroSlide[] =
    data?.heroSlides?.length > 0
      ? data.heroSlides
      : data
      ? [
          {
            badge: data.heroBadge,
            headlinePrimary: data.heroHeadlinePrimary,
            headlineSecondary: data.heroHeadlineSecondary,
            description: data.heroDescription,
            image: data.heroImage,
          },
        ]
      : [];

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (error || slides.length === 0) {
    return <section>Nothing to show right now.</section>;
  }

  const slide = slides[currentIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-white">
      <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-green-300/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          {slide.badge && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              {slide.badge}
            </span>
          )}

          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
            {slide.headlinePrimary}{" "}
            <span className="text-green-600">{slide.headlineSecondary}</span>
          </h1>

          <p className="mt-4 max-w-md text-sm text-gray-500">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ShieldCheck size={16} />
              </span>
              <span className="text-sm font-medium text-gray-700">
                1 Year Warranty
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Zap size={16} />
              </span>
              <span className="text-sm font-medium text-gray-700">
                Next-Day Delivery
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-72 w-full sm:h-96 lg:h-[420px]">
          {slide.image && (
            <Image
              src={slide.image}
              alt={slide.headlinePrimary || "Hero image"}
              className="object-contain"
              fill
              loading="eager"
            />
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="relative mb-8 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-6 bg-green-500" : "w-1.5 bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
