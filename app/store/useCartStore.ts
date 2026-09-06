import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sku?: string;
  stock?: number;
  quantity: number;
}

export type CartInput = Omit<CartItem, "quantity">;

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addItem: (product: CartInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  subtotal: () => number;
  totalQuantity: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            const maxStock = existing.stock ?? Infinity;
            const nextQty = Math.min(existing.quantity + quantity, maxStock);
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: nextQty } : item
              ),
            };
          }

          const maxStock = product.stock ?? Infinity;
          return {
            items: [
              ...state.items,
              { ...product, quantity: Math.min(quantity, maxStock) },
            ],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id !== id) return item;
              const maxStock = item.stock ?? Infinity;
              const clamped = Math.max(1, Math.min(quantity, maxStock));
              return { ...item, quantity: clamped };
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      increment: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        get().updateQuantity(id, item.quantity + 1);
      },

      decrement: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        if (item.quantity <= 1) {
          get().removeItem(id);
        } else {
          get().updateQuantity(id, item.quantity - 1);
        }
      },

      clearCart: () => set({ items: [] }),

      isInCart: (id) => get().items.some((item) => item.id === id),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      totalQuantity: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "techstore-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
