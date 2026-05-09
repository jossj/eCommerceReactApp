import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { login as loginApi, register as registerApi, getUserById } from '../api/auth'
import { addItemToCart } from '../api/cart'

export function useAuth() {
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout, setUser } = useAuthStore()
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
    mutationFn: loginApi,
    onSuccess: async ({ token, userId, email, role }) => {
      // Store minimal user + token immediately so authenticated requests work
      storeLogin({ id: userId, email, role }, token)
      // Fetch full profile (firstName, lastName, etc.) now that the token is active
      const fullUser = await getUserById(userId)
      setUser(fullUser)
      await mergeLocalCartToBackend(userId)
      const from = location.state?.from || '/'
      navigate(from)
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: async ({ token, userId, email, role }) => {
      storeLogin({ id: userId, email, role }, token)
      const fullUser = await getUserById(userId)
      setUser(fullUser)
      await mergeLocalCartToBackend(userId)
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
