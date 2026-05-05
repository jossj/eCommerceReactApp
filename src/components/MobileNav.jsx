import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

export default function MobileNav({ isOpen, onClose }) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    clearCart()
    onClose()
    navigate('/login')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <span className="text-xl font-bold text-indigo-600">ShopApp</span>
        <button
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="flex flex-col p-6 gap-2 flex-1">
        <Link
          to="/"
          onClick={onClose}
          className="py-3 px-4 text-lg font-medium text-gray-800 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Products
        </Link>
        <Link
          to="/cart"
          onClick={onClose}
          className="py-3 px-4 text-lg font-medium text-gray-800 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cart
        </Link>
        {isAuthenticated && (
          <Link
            to="/checkout"
            onClick={onClose}
            className="py-3 px-4 text-lg font-medium text-gray-800 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Checkout
          </Link>
        )}
      </nav>

      <div className="p-6 border-t border-gray-100">
        {isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Signed in as <span className="font-medium text-gray-800">{user?.email}</span></p>
            <button
              onClick={handleLogout}
              className="w-full min-h-[44px] py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="block w-full text-center min-h-[44px] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}
