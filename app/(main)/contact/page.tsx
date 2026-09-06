"use client";

import { useState } from "react";
import {
  Headphones,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  ShieldCheck,
  Building2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    title: "Call Us Direct",
    value: "+880 1234-TECH-00",
    meta: "Mon - Sun: 9:00 AM - 10:00 PM",
    action: "Call Now",
    href: "tel:+8801234832400",
  },
  {
    icon: Mail,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "Email Support",
    value: "support@techstore.io",
    meta: "Average response: < 2 hours",
    action: "Send Mail",
    href: "mailto:support@techstore.io",
  },
  {
    icon: MapPin,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    title: "Flagship Experience Hub",
    value: "Dhanmondi 27, Dhaka 1209",
    meta: "Tech District, Bangladesh",
    action: "Get Directions",
    href: "https://maps.google.com",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "WhatsApp Live Support",
    value: "+880 1700-TECH-WA",
    meta: "Instant messenger response",
    action: "Chat Now",
    href: "https://wa.me/8801700832492",
  },
];

const faqs = [
  {
    question: "How fast do you respond to contact inquiries?",
    answer:
      "Our customer support team operates 7 days a week. Email inquiries are typically answered within 2 hours, while WhatsApp and phone calls offer instant support during business hours.",
  },
  {
    question: "Can I request a custom PC build quote through this form?",
    answer:
      "Yes! Select 'Custom PC Build Quote' as your topic, specify your budget and intended usage (gaming, rendering, AI/ML), and our hardware engineers will send you a tailored component breakdown.",
  },
  {
    question: "How do I claim product warranty or request a replacement?",
    answer:
      "Include your Order ID in the form above and select 'Warranty & Technical Support'. Attach details of the issue and our team will issue an RMA ticket with pickup instructions.",
  },
  {
    question: "Where is TechStore's physical experience center located?",
    answer:
      "Our flagship hub is located at Dhanmondi 27, Dhaka 1209. You can visit us to test demo rigs, inspect audio gadgets, or pick up online orders.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    orderIdOrPhone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSubmitting(false);
    setSubmitted(true);
    setForm({ name: "", email: "", topic: "General Inquiry", orderIdOrPhone: "", message: "" });
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50/60 to-white">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-600 ring-1 ring-green-100">
            <Headphones size={13} />
            24/7 Dedicated Support Center
          </span>

          <h1 className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl">
            Let&apos;s Start a <span className="text-green-500">Conversation</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Have a question about a product, custom rig quote, order tracking,
            or warranty support? Our expert tech team is ready to assist you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => (
            <div
              key={method.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${method.iconBg} ${method.iconColor}`}>
                <method.icon size={20} />
              </span>

              <h3 className="mt-4 text-base font-bold text-gray-900">
                {method.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-gray-700">
                {method.value}
              </p>
              <p className="text-xs text-gray-400">{method.meta}</p>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <a
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
                >
                  {method.action}
                  <Send size={12} className="-rotate-45" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Send Us a Message</h2>
                <p className="text-sm text-gray-500">
                  Fill in the details below and we'll reply shortly.
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <MessageCircle size={16} />
              </span>
            </div>

            <div className="my-5 h-px bg-gray-100" />

            {submitted && (
              <p className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                Message sent — our team will get back to you shortly.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Your Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Tanvir Rahman"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="tanvir@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Inquiry Topic
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  >
                    <option>General Inquiry</option>
                    <option>Custom PC Build Quote</option>
                    <option>Order Tracking</option>
                    <option>Warranty & Technical Support</option>
                    <option>Partnership / Bulk Order</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order ID / Phone <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    placeholder="e.g. #ORD-9842 or 01700..."
                    value={form.orderIdOrPhone}
                    onChange={(e) => setForm({ ...form, orderIdOrPhone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can our technical team help you today?"
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
                {isSubmitting ? "Sending…" : "Submit Message"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-[#0b1220] p-6 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-green-400">
                <Clock size={12} />
                Operating Hours
              </span>

              <h3 className="mt-4 text-base font-bold">Visit Our Flagship Hub</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">Saturday & Sunday</span>
                  <span className="font-semibold">10:00 AM - 9:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Online Support</span>
                  <span className="font-semibold text-green-400">24/7 Available</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={13} className="text-green-400" />
                Instant ticket confirmation generated upon submission.
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Building2 size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    TechStore Headquarters
                  </p>
                  <p className="text-xs text-gray-400">
                    Dhanmondi 27, Dhaka 1209, Bangladesh
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl">
                <iframe
                  title="TechStore location"
                  src="https://www.google.com/maps?q=Dhanmondi+27,+Dhaka+1209&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 ring-1 ring-gray-100">
              <HelpCircle size={12} className="text-green-500" />
              Got Questions?
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
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
                    <div className="border-t border-gray-100 px-6 py-4">
                      <p className="text-sm leading-relaxed text-gray-500">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
