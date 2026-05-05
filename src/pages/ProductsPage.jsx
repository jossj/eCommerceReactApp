import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import CartDrawer from '../components/CartDrawer'

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 mt-1">Browse our collection</p>
      </div>

      {isLoading && <LoadingSpinner />}

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load products</p>
          <p className="text-red-400 text-sm mt-1">{error?.message}</p>
        </div>
      )}

      {products && products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl">📦</span>
          <p className="mt-4 font-medium">No products found</p>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <CartDrawer />
    </main>
  )
}
