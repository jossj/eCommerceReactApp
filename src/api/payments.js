import api from './axios'

export const createPaymentIntent = (data) =>
  api.post('/payments/intents', data).then((r) => r.data)

export const confirmPaymentIntent = (intentId, paymentMethodId) =>
  api.post(`/payments/intents/${intentId}/confirm`, { paymentMethodId }).then((r) => r.data)
