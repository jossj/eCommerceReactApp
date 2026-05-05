import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
} from '../api/cart'

function backendItemToLocal(item) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.productName,
    price: Number(item.unitPrice),
    quantity: item.quantity,
    imageUrl: null,
  }
}

export function useCart() {
  const store = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  // Fetch backend cart when logged in and sync to local store
  const { data: backendCart } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => getCart(user.id),
    enabled: isAuthenticated && !!user?.id,
  })

  useEffect(() => {
    if (backendCart) {
      store.setCartId(backendCart.id)
      store.setItems(backendCart.cartItems.map(backendItemToLocal))
    }
  }, [backendCart])

  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }) =>
      addItemToCart(user.id, { productId, quantity }),
    onSuccess: invalidateCart,
  })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) =>
      updateCartItem(user.id, itemId, quantity),
    onSuccess: invalidateCart,
  })

  const removeMutation = useMutation({
    mutationFn: ({ itemId }) => removeCartItem(user.id, itemId),
    onSuccess: invalidateCart,
  })

  const addItem = (product, quantity = 1) => {
    if (isAuthenticated) {
      addMutation.mutate({ productId: product.id, quantity })
    } else {
      store.addItem(product, quantity)
    }
  }

  const removeItem = (productId) => {
    if (isAuthenticated) {
      const item = store.items.find((i) => i.productId === productId)
      if (item?.id) removeMutation.mutate({ itemId: item.id })
    } else {
      store.removeItem(productId)
    }
  }

  const updateQuantity = (productId, quantity) => {
    if (isAuthenticated) {
      const item = store.items.find((i) => i.productId === productId)
      if (!item?.id) return
      if (quantity < 1) {
        removeMutation.mutate({ itemId: item.id })
      } else {
        updateMutation.mutate({ itemId: item.id, quantity })
      }
    } else {
      store.updateQuantity(productId, quantity)
    }
  }

  const handleClearCart = async () => {
    if (isAuthenticated && user?.id) {
      await clearUserCart(user.id)
      invalidateCart()
    }
    store.clearCart()
  }

  const totalItems = store.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = store.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return {
    items: store.items,
    cartId: store.cartId,
    isOpen: store.isOpen,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart: handleClearCart,
    totalItems,
    totalPrice,
  }
}
