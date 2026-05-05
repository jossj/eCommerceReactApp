import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../stores/authStore'
import { useCheckoutStore } from '../stores/checkoutStore'
import { createOrder, addOrderItem } from '../api/orders'
import { processPayment } from '../api/payments'
import CheckoutSteps from '../components/CheckoutSteps'

function ShippingForm({ shipping, onChange, onNext, onBack }) {
  const fields = [
    { id: 'fullName', label: 'Full name', type: 'text', placeholder: 'John Doe' },
    { id: 'address', label: 'Street address', type: 'text', placeholder: '123 Main St' },
    { id: 'city', label: 'City', type: 'text', placeholder: 'Springfield' },
    { id: 'state', label: 'State / Province', type: 'text', placeholder: 'IL' },
    { id: 'zip', label: 'ZIP / Postal code', type: 'text', placeholder: '62701' },
    { id: 'country', label: 'Country', type: 'text', placeholder: 'United States' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
      {fields.map(({ id, label, type, placeholder }) => (
        <div key={id}>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
            {label}
          </label>
          <input
            id={id}
            type={type}
            required
            value={shipping[id]}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
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

function PaymentForm({ payment, onChange, onBack, onPay, isLoading, error }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onPay()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cardName">
          Name on card
        </label>
        <input id="cardName" type="text" required value={payment.cardName}
          onChange={(e) => onChange('cardName', e.target.value)}
          placeholder="John Doe"
          className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cardNumber">
          Card number
        </label>
        <input id="cardNumber" type="text" required value={payment.cardNumber}
          onChange={(e) => onChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
          placeholder="4111 1111 1111 1111" maxLength={16}
          className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiry">
            Expiry
          </label>
          <input id="expiry" type="text" required value={payment.expiry}
            onChange={(e) => onChange('expiry', e.target.value)}
            placeholder="MM/YY" maxLength={5}
            className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cvv">
            CVV
          </label>
          <input id="cvv" type="text" required value={payment.cvv}
            onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123" maxLength={4}
            className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error.response?.data?.message || error.message || 'Payment failed. Please try again.'}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onBack} disabled={isLoading}
          className="flex-1 min-h-[44px] py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">
          ← Back
        </button>
        <button type="submit" disabled={isLoading}
          className="flex-1 min-h-[44px] py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
          {isLoading ? 'Processing…' : '💳 Pay Now'}
        </button>
      </div>
    </form>
  )
}

function CartReview({ items, totalPrice, onNext }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
            </div>
            <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <button onClick={onNext}
        className="w-full min-h-[44px] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
        Continue to Shipping →
      </button>
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuthStore()
  const { step, shipping, payment, nextStep, prevStep, setShipping, setPayment, setOrderId } = useCheckoutStore()
  const [payError, setPayError] = useState(null)

  const payMutation = useMutation({
    mutationFn: async () => {
      const order = await createOrder({
        userId: user.id,
        totalAmount: totalPrice,
        status: 'PENDING',
        shippingAddress: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        country: shipping.country,
      })

      await Promise.all(
        items.map((item) =>
          addOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })
        )
      )

      const paymentResult = await processPayment({
        orderId: order.id,
        amount: totalPrice,
        paymentMethod: 'CREDIT_CARD',
        cardName: payment.cardName,
        cardNumber: payment.cardNumber,
        cardExpiry: payment.expiry,
        cardCvv: payment.cvv,
      })

      return { order, paymentResult }
    },
    onSuccess: ({ order }) => {
      setOrderId(order.id)
      clearCart()
      nextStep()
    },
    onError: (err) => {
      setPayError(err)
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
            shipping={shipping}
            onChange={(field, value) => setShipping({ [field]: value })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <PaymentForm
            payment={payment}
            onChange={(field, value) => setPayment({ [field]: value })}
            onBack={prevStep}
            onPay={() => { setPayError(null); payMutation.mutate() }}
            isLoading={payMutation.isPending}
            error={payError}
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
