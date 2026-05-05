import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { getUserByEmail, register as registerApi } from '../api/auth'
import { addItemToCart } from '../api/cart'

export function useAuth() {
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore()
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const mergeLocalCartToBackend = async (userId) => {
    const localItems = useCartStore.getState().items
    if (localItems.length === 0) return
    await Promise.allSettled(
      localItems.map((item) =>
        addItemToCart(userId, { productId: item.productId, quantity: item.quantity })
      )
    )
    queryClient.invalidateQueries({ queryKey: ['cart', userId] })
  }

  const loginMutation = useMutation({
    mutationFn: ({ email }) => getUserByEmail(email),
    onSuccess: async (fetchedUser) => {
      storeLogin(fetchedUser)
      await mergeLocalCartToBackend(fetchedUser.id)
      const from = location.state?.from || '/'
      navigate(from)
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: async (newUser) => {
      storeLogin(newUser)
      await mergeLocalCartToBackend(newUser.id)
      navigate('/')
    },
  })

  const logout = () => {
    storeLogout()
    clearCart()
    navigate('/login')
  }

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    register: registerMutation.mutate,
    registerError: registerMutation.error,
    registerPending: registerMutation.isPending,
    logout,
  }
}
