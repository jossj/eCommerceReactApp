import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { login as loginApi, register as registerApi } from '../api/auth'

export function useAuth() {
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore()
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      storeLogin(data.user, data.token || data.accessToken)
      navigate('/')
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      storeLogin(data.user, data.token || data.accessToken)
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
    token,
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
