import { useCartStore } from '../stores/cartStore'

export function useCart() {
  const store = useCartStore()
  const totalItems = store.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = store.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return { ...store, totalItems, totalPrice }
}
