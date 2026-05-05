import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../stores/authStore'
import { useCheckoutStore } from '../stores/checkoutStore'
import { createOrderFromCart } from '../api/orders'
import { processPayment } from '../api/payments'
import CheckoutSteps from '../components/CheckoutSteps'

const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
]

function CartReview({ items, totalPrice, onNext }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={onNext}
            className="w-full min-h-[44px] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue to Shipping →
          </button>
        </>
      )}
    </div>
  )
}

function ShippingForm({ value, onChange, onNext, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
      <p className="text-sm text-gray-500 -mt-2">
        Enter your full address (e.g. 123 Main St, Springfield, IL 62701, USA)
      </p>
      <textarea
        required
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="123 Main St, Springfield, IL 62701, USA"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
      />
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack}
          className="flex-1 min-h-[44px] py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
          ← Back
        </button>
        <button type="submit"
          className="flex-1 min-h-[44px] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          Continue →
        </button>
      </div>
    </form>
  )
}

function PaymentForm({ paymentMethod, onChange, onBack, onPay, isLoading, error }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onPay()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map(({ value, label }) => (
          <label
            key={value}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors
              ${paymentMethod === value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={value}
              checked={paymentMethod === value}
              onChange={(e) => onChange(e.target.value)}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="font-medium text-gray-800">{label}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error.response?.data?.message || error.message || 'Payment failed. Please try again.'}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} disabled={isLoading}
          className="flex-1 min-h-[44px] py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">
          ← Back
        </button>
        <button type="submit" disabled={isLoading}
          className="flex-1 min-h-[44px] py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
          {isLoading ? 'Processing…' : '💳 Place Order'}
        </button>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuthStore()
  const {
    step, shippingAddress, paymentMethod,
    nextStep, prevStep,
    setShippingAddress, setPaymentMethod, setOrderId,
  } = useCheckoutStore()

  const payMutation = useMutation({
    mutationFn: async () => {
      const order = await createOrderFromCart(user.id, shippingAddress)
      const payment = await processPayment({
        orderId: order.id,
        paymentMethod,
        amount: order.totalAmount,
        currency: 'USD',
      })
      return { order, payment }
    },
    onSuccess: async ({ order }) => {
      setOrderId(order.id)
      await clearCart()
      nextStep()
    },
  })

  if (items.length === 0 && step < 4) {
    navigate('/cart')
    return null
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <CheckoutSteps current={step} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {step === 1 && (
          <CartReview items={items} totalPrice={totalPrice} onNext={nextStep} />
        )}

        {step === 2 && (
          <ShippingForm
            value={shippingAddress}
            onChange={setShippingAddress}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <PaymentForm
            paymentMethod={paymentMethod}
            onChange={setPaymentMethod}
            onBack={prevStep}
            onPay={() => payMutation.mutate()}
            isLoading={payMutation.isPending}
            error={payMutation.error}
          />
        )}

        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-500 mb-6">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <button
              onClick={() => { useCheckoutStore.getState().reset(); navigate('/') }}
              className="min-h-[44px] px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
