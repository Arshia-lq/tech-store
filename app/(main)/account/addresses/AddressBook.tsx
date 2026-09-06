"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Home,
  Building2,
  Star,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

interface Address {
  _id: string;
  name: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  landmark?: string;
  addressType: "Home" | "Office";
  isDefault: boolean;
}

const emptyForm = {
  name: "",
  phone: "",
  city: "",
  area: "",
  address: "",
  landmark: "",
  addressType: "Home" as "Home" | "Office",
  isDefault: false,
};

export default function AddressBook() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadAddresses() {
    setLoading(true);
    fetch("/api/user/addresses")
      .then((res) => res.json())
      .then((data) => setAddresses(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  }

  function openEditModal(addr: Address) {
    setEditingId(addr._id);
    setForm({
      name: addr.name || "",
      phone: addr.phone || "",
      city: addr.city || "",
      area: addr.area || "",
      address: addr.address || "",
      landmark: addr.landmark || "",
      addressType: addr.addressType || "Home",
      isDefault: addr.isDefault || false,
    });
    setError(null);
    setModalOpen(true);
  }

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setError(null);

    if (!form.name || !form.phone || !form.city || !form.area || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: form, id: editingId || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address");

      setAddresses(data.addresses);
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete address");
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete address.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm transition hover:text-gray-900"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Saved Addresses
            </h1>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Shipping & Delivery
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600"
        >
          <Plus size={15} />
          Add Address
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-24 text-center text-sm text-gray-400">
          Loading your addresses…
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
            <MapPin size={28} />
          </span>
          <h2 className="mt-5 text-xl font-bold text-gray-900">No Addresses Found</h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Save your shipping details now for a faster, 1-click checkout
            experience later.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 rounded-full bg-green-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600"
          >
            Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                  {addr.addressType === "Office" ? <Building2 size={17} /> : <Home size={17} />}
                </span>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-600">
                    <Star size={10} fill="currentColor" />
                    Primary
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm font-bold text-gray-900">{addr.name}</p>
              <p className="text-xs text-gray-500">{addr.phone}</p>
              <p className="mt-2 text-sm text-gray-600">
                {addr.address}, {addr.area}, {addr.city}
              </p>
              {addr.landmark && (
                <p className="text-xs text-gray-400">Landmark: {addr.landmark}</p>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-4">
                <button
                  onClick={() => openEditModal(addr)}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white">
                  <MapPin size={18} />
                </span>
                <h2 className="text-lg font-extrabold text-gray-900">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  City / Region
                </label>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Area / Sub-district
                </label>
                <input
                  value={form.area}
                  onChange={(e) => update("area", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Detailed Shipping Address
                </label>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {(["Home", "Office"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("addressType", type)}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
                        form.addressType === type
                          ? "bg-green-500 text-white"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Landmark (optional)
                </label>
                <input
                  value={form.landmark}
                  onChange={(e) => update("landmark", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => update("isDefault", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              Set as Primary Address
            </label>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl bg-gray-50 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-green-500 py-3 text-sm font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
