import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import MobileNav from './MobileNav'

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalItems, toggleCart } = useCart()
  const { isAuthenticated, user, logout } = useAuthStore()
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    clearCart()
    navigate('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
            ShopApp
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Products
            </Link>
            {isAuthenticated && (
              <span className="text-sm text-gray-500">Hi, {user?.email}</span>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart button — opens drawer on desktop, navigates on mobile */}
            <button
              onClick={toggleCart}
              className="hidden md:flex relative min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label={`Cart, ${totalItems} items`}
            >
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <Link
              to="/cart"
              className="md:hidden relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label={`Cart, ${totalItems} items`}
            >
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
