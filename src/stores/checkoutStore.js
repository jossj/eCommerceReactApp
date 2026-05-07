import { create } from 'zustand'

export const useCheckoutStore = create((set) => ({
  step: 1,
  shippingAddress: '',
  paymentMethod: 'CREDIT_CARD',
  orderId: null,
  transactionId: null,

  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  setStep: (step) => set({ step }),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setOrderId: (orderId) => set({ orderId }),
  setTransactionId: (transactionId) => set({ transactionId }),
  reset: () => set({ step: 1, shippingAddress: '', paymentMethod: 'CREDIT_CARD', orderId: null, transactionId: null }),
}))
