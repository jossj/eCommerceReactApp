import api from './axios'

// paymentData: { orderId, paymentMethod, amount, currency }
// paymentMethod: CREDIT_CARD | DEBIT_CARD | PAYPAL | BANK_TRANSFER | CASH_ON_DELIVERY
export const processPayment = (paymentData) =>
  api.post('/payments', paymentData).then((r) => r.data)
