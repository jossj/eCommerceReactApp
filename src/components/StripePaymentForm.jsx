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
          <CardElement options={CARD_STYLE} onChange={(e) => e.error && setCardError(e.error.message)} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Test card: 4242 4242 4242 4242 · any future date · any CVC</p>
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
          disabled={!stripe || isProcessing}
          className="flex-1 min-h-[44px] py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? 'Processing…' : `💳 Pay $${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </form>
  )
}
