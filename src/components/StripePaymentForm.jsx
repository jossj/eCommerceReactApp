import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#111827',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
}

export default function StripePaymentForm({ totalPrice, onPay, onBack, isProcessing }) {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState(null)
  const stripeReady = !!stripe

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setCardError(null)
    const card = elements.getElement(CardElement)
    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card })

    if (error) {
      setCardError(error.message)
      return
    }

    onPay(paymentMethod.id)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Card Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Credit or debit card
        </label>
        <div className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow">
          <CardElement options={CARD_STYLE} onChange={(e) => setCardError(e.error?.message ?? null)} />
        </div>
        <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="font-medium text-gray-600">Test card</span>
          <span>Number: <span className="font-mono text-gray-700">4242 4242 4242 4242</span></span>
          <span>Expiry: <span className="font-mono text-gray-700">12/26</span></span>
          <span>CVC: <span className="font-mono text-gray-700">123</span></span>
        </div>
      </div>

      {cardError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {cardError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 min-h-[44px] py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!stripeReady || isProcessing}
          title={!stripeReady ? 'Stripe is not configured — set VITE_STRIPE_PUBLIC_KEY in .env.local' : undefined}
          className="flex-1 min-h-[44px] py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processing…' : !stripeReady ? 'Stripe not configured' : `💳 Pay $${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </form>
  )
}
