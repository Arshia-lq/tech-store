"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Zap,
  ImagePlus,
  Trash2,
  Save,
  ImageIcon,
} from "lucide-react";

interface Slide {
  badge: string;
  headlinePrimary: string;
  headlineSecondary: string;
  description: string;
  image: string;
}

const emptySlide: Slide = {
  badge: "",
  headlinePrimary: "",
  headlineSecondary: "",
  description: "",
  image: "",
};

const MAX_SLIDES = 4;

export default function BannerManager({
  initialSlides,
}: {
  initialSlides: Slide[];
}) {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>(
    initialSlides.length ? initialSlides : [emptySlide]
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageDraft, setImageDraft] = useState<Record<number, string>>({});

  function updateSlide(index: number, field: keyof Slide, value: string) {
    setSlides((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addSlide() {
    if (slides.length >= MAX_SLIDES) return;
    setSlides((prev) => [...prev, emptySlide]);
  }

  function deleteSlide(index: number) {
    const confirmed = window.confirm("Remove this slide? This cannot be undone until you save.");
    if (!confirmed) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
  }

  function applyImage(index: number) {
    const url = imageDraft[index];
    if (!url?.trim()) return;
    updateSlide(index, "image", url.trim());
    setImageDraft((prev) => ({ ...prev, [index]: "" }));
  }

  async function handleSaveAll() {
    setError(null);
    setMessage(null);
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroSlides: slides }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");

      setMessage("Banner configuration saved successfully.");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Zap size={18} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Hero Spotlight
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Customize the premium spotlight section of your platform's home page.
            </p>
          </div>
        </div>

        <button
          onClick={addSlide}
          disabled={slides.length >= MAX_SLIDES}
          className="flex w-fit items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImagePlus size={14} />
          Add Slide ({slides.length}/{MAX_SLIDES})
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}
      {message && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">{message}</p>
      )}

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                  {index + 1}
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  Slide Configuration
                </h2>
              </div>

              <button
                onClick={() => deleteSlide(index)}
                disabled={slides.length === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Delete this slide"
                title="Delete slide"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="my-5 h-px bg-gray-100" />

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Badge Text
                </label>
                <input
                  value={slide.badge}
                  onChange={(e) => updateSlide(index, "badge", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Headline (Static Part)
                  </label>
                  <input
                    value={slide.headlinePrimary}
                    onChange={(e) => updateSlide(index, "headlinePrimary", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Headline (Highlight Part)
                  </label>
                  <input
                    value={slide.headlineSecondary}
                    onChange={(e) => updateSlide(index, "headlineSecondary", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-green-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Hero Description
                </label>
                <textarea
                  rows={3}
                  value={slide.description}
                  onChange={(e) => updateSlide(index, "description", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  <ImageIcon size={12} />
                  Slide Illustration
                </label>

                <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                  <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-gray-50">
                    {slide.image ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={slide.image}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">No image set</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:justify-end">
                    <input
                      placeholder="Paste image URL (e.g. from imgbb)"
                      value={imageDraft[index] ?? ""}
                      onChange={(e) =>
                        setImageDraft((prev) => ({ ...prev, [index]: e.target.value }))
                      }
                      className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs outline-none focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => applyImage(index)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-gray-800"
                    >
                      <ImagePlus size={13} />
                      Update Illustration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-green-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-green-500/30 transition hover:bg-green-600 disabled:opacity-60"
        >
          <Save size={16} />
          {isSaving ? "Saving…" : "Save All Configuration"}
        </button>
      </div>
    </div>
  );
}
