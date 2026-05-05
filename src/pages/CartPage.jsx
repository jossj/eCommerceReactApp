import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../stores/authStore'
import CartItem from '../components/CartItem'

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
    } else {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Your cart is empty</h1>
        <p className="text-gray-500 mt-2">Add some products to get started</p>
        <Link
          to="/"
          className="inline-block mt-6 min-h-[44px] px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Browse Products
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Cart <span className="text-gray-400 font-normal text-lg">({totalItems} items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}

          <Link
            to="/"
            className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <aside className="lg:w-80 shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm text-gray-600">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                  <span className="font-medium shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 min-h-[44px] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              {isAuthenticated ? 'Proceed to Checkout →' : 'Sign In to Checkout →'}
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}
