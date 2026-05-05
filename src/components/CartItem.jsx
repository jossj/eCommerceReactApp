import { useCart } from '../hooks/useCart'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🛍</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-sm text-indigo-600 font-semibold">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="text-right shrink-0">
        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
