"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  LayoutGrid,
  Smartphone,
  Laptop,
  Monitor,
  Cpu,
  Mouse,
  Keyboard,
  HardDrive,
  Tv,
  Gamepad2,
  Watch,
  Headphones,
  Speaker,
  Camera,
  Zap,
  Wifi,
  Video,
  Wrench,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";

const ICON_OPTIONS: Record<string, any> = {
  grid: LayoutGrid,
  smartphone: Smartphone,
  laptop: Laptop,
  monitor: Monitor,
  cpu: Cpu,
  mouse: Mouse,
  keyboard: Keyboard,
  harddrive: HardDrive,
  tv: Tv,
  gamepad: Gamepad2,
  watch: Watch,
  headphones: Headphones,
  speaker: Speaker,
  camera: Camera,
  zap: Zap,
  wifi: Wifi,
  video: Video,
  wrench: Wrench,
};

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  icon: string | null;
  parent: string | null;
  productCount: number;
}

function CategoryIcon({ icon }: { icon: string | null }) {
  const Icon = (icon && ICON_OPTIONS[icon]) || LayoutGrid;
  return <Icon size={18} />;
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryData[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);

  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [icon, setIcon] = useState("grid");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topLevelCategories = categories.filter((c) => !c.parent);

  function resetForm() {
    setName("");
    setParent("");
    setIcon("grid");
    setEditingId(null);
    setError(null);
  }

  function startEdit(category: CategoryData) {
    setEditingId(category._id);
    setName(category.name);
    setParent(category.parent || "");
    setIcon(category.icon || "grid");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = editingId ? "/api/categories" : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { id: editingId, name, parent: parent || null, icon }
        : { name, parent: parent || null, icon };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      resetForm();
      router.refresh();

      if (editingId) {
        setCategories((prev) =>
          prev.map((c) => (c._id === editingId ? { ...c, name, parent: parent || null, icon } : c))
        );
      } else {
        setCategories((prev) => [
          ...prev,
          { _id: data._id, name: data.name, slug: data.slug, icon: data.icon, parent: data.parent, productCount: 0 },
        ]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this category? This cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c._id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      <div className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
          {editingId ? (
            <>
              <Pencil size={16} className="text-green-500" />
              Edit Category
            </>
          ) : (
            <>
              <Plus size={16} className="text-green-500" />
              Add New Category
            </>
          )}
        </h2>

        <div className="my-4 h-px bg-gray-100" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile Phones"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Parent (make this a sub-category)
            </label>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            >
              <option value="">None (Top Level Category)</option>
              {topLevelCategories
                .filter((c) => c._id !== editingId)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Visual Icon
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Object.entries(ICON_OPTIONS).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  className={`flex h-12 w-full items-center justify-center rounded-xl transition ${
                    icon === key
                      ? "bg-green-500 text-white"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSubmitting ? "Saving…" : editingId ? "Save Changes" : "Publish Category"}
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <LayoutGrid size={18} />
          </span>
          <div>
            <h2 className="text-base font-bold text-gray-900">System Categories</h2>
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
              {categories.length} Total Entries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span>Structure</span>
          <span>Products</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {categories.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400">No categories yet.</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4"
              >
                <div className={`flex items-center gap-3 ${cat.parent ? "pl-8" : ""}`}>
                  {cat.parent && <ArrowRight size={13} className="text-gray-300" />}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white">
                    <CategoryIcon icon={cat.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    cat.productCount > 0
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {cat.productCount} UNITS
                </span>

                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => startEdit(cat)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                    aria-label="Edit category"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
