import { useCart } from '../hooks/useCart'

export default function ProductCard({ product }) {
  const { addItem, items } = useCart()
  const inCart = items.find((i) => i.productId === product.id)

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <picture>
            <source
              srcSet={`${product.imageUrl}?w=400 400w, ${product.imageUrl}?w=800 800w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </picture>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-6xl">
            🛍
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-lg font-bold text-indigo-600">${product.price?.toFixed(2)}</span>
          <button
            onClick={() => addItem(product)}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors
              ${inCart
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
            {inCart ? `In cart (${inCart.quantity})` : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
