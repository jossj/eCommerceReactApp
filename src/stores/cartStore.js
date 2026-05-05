import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      setCartId: (cartId) => set({ cartId }),
      setItems: (items) => set({ items }),

      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existing = items.find((i) => i.productId === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                id: null,
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl || null,
              },
            ],
          })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [], cartId: null }),
    }),
    { name: 'cart-storage' }
  )
)
