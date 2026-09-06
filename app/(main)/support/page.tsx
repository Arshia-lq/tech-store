"use client";

import { useMemo, useState } from "react";
import {
  MessageCircle,
  Search,
  Zap,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
} from "lucide-react";

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Shipping typically takes 3-5 business days for domestic orders and 7-14 days for international shipping. You'll receive a tracking number as soon as your order leaves our warehouse.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return it in its original packaging for a full refund or exchange.",
  },
  {
    question: "Are your products covered by warranty?",
    answer:
      "Yes! All electronic devices come with a standard 12-month manufacturer warranty. Some premium brands offer extended warranties up to 24 months.",
  },
  {
    question: "Do you offer technical support for setup?",
    answer:
      "Absolutely. Our technical team is available 24/7 via live chat or phone to help you configure your new devices and troubleshoot any initial connectivity issues.",
  },
];

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    );
  }, [search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSubmitting(false);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div>
      <section className="bg-green-500 pb-32 pt-16 text-center text-white">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
          <MessageCircle size={13} />
          How Can We Help You Today?
        </span>

        <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
          Help <span className="text-green-100">Center</span>
        </h1>

        <div className="mx-auto mt-8 max-w-xl px-6">
          <div className="flex items-center gap-3 rounded-full bg-white px-5 py-4 shadow-lg">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help articles (shipping, returns, warranty...)"
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-20 max-w-[1600px] px-6 pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Zap size={18} className="text-green-500" />
                Frequently Asked Questions
              </h2>

              <div className="mt-5 divide-y divide-gray-100">
                {filteredFaqs.length === 0 ? (
                  <p className="py-6 text-sm text-gray-400">
                    No help articles match your search.
                  </p>
                ) : (
                  filteredFaqs.map((faq, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={faq.question} className="py-4">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <span
                            className={`text-sm font-bold ${
                              isOpen ? "text-green-600" : "text-gray-900"
                            }`}
                          >
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp size={16} className="shrink-0 text-green-500" />
                          ) : (
                            <ChevronDown size={16} className="shrink-0 text-gray-400" />
                          )}
                        </button>

                        {isOpen && (
                          <p className="mt-3 text-sm leading-relaxed text-gray-500">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Mail size={18} className="text-green-500" />
                Direct Message
              </h2>

              <div className="my-5 h-px bg-gray-100" />

              {submitted && (
                <p className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                  Message sent — our support team will get back to you shortly.
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Full Name
                    </label>
                    <input
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Message Detail
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
                >
                  <Send size={16} />
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Phone size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">Support Hotline</h3>
              <p className="mt-1 text-xs text-gray-400">
                Direct line for instant technical assistance.
              </p>
              <a
                href="tel:+8801234567890"
                className="mt-2 block text-sm font-bold text-green-600 hover:text-green-700"
              >
                +880 1234-567890
              </a>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <Mail size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">Email Help Desk</h3>
              <p className="mt-1 text-xs text-gray-400">
                Expect a detailed response within 1 business day.
              </p>
              <a
                href="mailto:support@techstore.com"
                className="mt-2 block text-sm font-bold text-green-600 hover:text-green-700"
              >
                support@techstore.com
              </a>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <MapPin size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">Global HQ</h3>
              <p className="mt-1 text-xs text-gray-400">
                Visit our tech hub in the heart of the city.
              </p>
              <p className="mt-2 text-sm font-bold text-green-600">
                Dhaka, Bangladesh
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-green-500 p-6 text-white">
              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />

              <Sparkles size={20} className="text-amber-300" />
              <h3 className="relative mt-4 text-lg font-bold">Live Resolution</h3>
              <p className="relative mt-2 text-sm text-green-50">
                Our expert engineers are online right now to solve your
                hardware queries.
              </p>

              <button className="relative mt-5 w-full rounded-xl bg-white py-3 text-sm font-bold uppercase tracking-wide text-green-600 transition hover:bg-green-50">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
