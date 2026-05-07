import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../stores/authStore'
import { useCheckoutStore } from '../stores/checkoutStore'
import { createOrderFromCart } from '../api/orders'
import { createPaymentIntent } from '../api/payments'
import CheckoutSteps from '../components/CheckoutSteps'
import StripePaymentForm from '../components/StripePaymentForm'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

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
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext() }} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Shipping Address</h2>
      <p className="text-sm text-gray-500">
        Enter your full address including suburb, state and postcode (e.g. 42 Elm Street, Surry Hills NSW 2010)
      </p>
      <textarea
        required rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="42 Elm Street, Surry Hills NSW 2010"
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

function PaymentStep({ shippingAddress, onBack, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const { totalPrice, clearCart } = useCart()
  const { user } = useAuthStore()
  const stripe = useStripe()

  const handlePay = async (paymentMethodId) => {
    setProcessing(true)
    setError(null)
    try {
      const order = await createOrderFromCart(user.id, shippingAddress)

      const intent = await createPaymentIntent({
        orderId: order.id,
        paymentMethod: 'CREDIT_CARD',
        currency: 'AUD',
      })

      // Confirm client-side — card payments don't require a return_url.
      // The backend webhook handles payment_intent.succeeded asynchronously.
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intent.clientSecret,
        { payment_method: paymentMethodId }
      )

      if (stripeError) {
        setError(stripeError.message)
        setProcessing(false)
        return
      }

      if (paymentIntent.status !== 'succeeded') {
        setError(`Unexpected payment status: ${paymentIntent.status}. Please try again.`)
        setProcessing(false)
        return
      }

      await clearCart()
      onSuccess(order.id, paymentIntent.id)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <StripePaymentForm
        totalPrice={totalPrice}
        onPay={handlePay}
        onBack={onBack}
        isProcessing={processing}
      />
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items } = useCart()
  const { step, shippingAddress, orderId, transactionId, nextStep, prevStep, setShippingAddress, setOrderId, setTransactionId } =
    useCheckoutStore()

  const handlePaymentSuccess = (orderId, transactionId) => {
    setOrderId(orderId)
    setTransactionId(transactionId)
    nextStep()
  }

  if (items.length === 0 && step < 4) {
    navigate('/cart')
    return null
  }

  const { totalPrice } = items.reduce(
    (acc, i) => ({ totalPrice: acc.totalPrice + i.price * i.quantity }),
    { totalPrice: 0 }
  )

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <CheckoutSteps current={step} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {step === 1 && (
          <CartReview
            items={items}
            totalPrice={items.reduce((s, i) => s + i.price * i.quantity, 0)}
            onNext={nextStep}
          />
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
          <Elements stripe={stripePromise}>
            <PaymentStep
              shippingAddress={shippingAddress}
              onBack={prevStep}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}

        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">
              Your order has been placed and payment confirmed.
            </p>
            {transactionId && (
              <div className="mb-6 inline-block bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-left">
                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                <p className="font-mono text-sm text-gray-800 break-all">{transactionId}</p>
              </div>
            )}
            <div>
              <button
                onClick={() => { useCheckoutStore.getState().reset(); navigate('/') }}
                className="min-h-[44px] px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
