import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartItem from './CartItem'

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalItems, totalPrice } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:block hidden"
          onClick={closeCart}
        />
      )}

      {/* Drawer — slide-in on desktop, full-screen on mobile */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-2xl flex flex-col
          w-full md:w-96 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Cart {totalItems > 0 && <span className="text-indigo-600">({totalItems})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="font-medium">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.productId} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              onClick={closeCart}
              className="block w-full text-center min-h-[44px] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Cart &amp; Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
