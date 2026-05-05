import api from './axios'

export const processPayment = (paymentData) =>
  api.post('/payments', paymentData).then((r) => r.data)
