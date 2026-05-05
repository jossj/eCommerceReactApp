import { create } from 'zustand'

const emptyShipping = { fullName: '', address: '', city: '', state: '', zip: '', country: '' }
const emptyPayment = { cardName: '', cardNumber: '', expiry: '', cvv: '' }

export const useCheckoutStore = create((set) => ({
  step: 1,
  shipping: { ...emptyShipping },
  payment: { ...emptyPayment },
  orderId: null,

  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  setStep: (step) => set({ step }),
  setShipping: (data) => set((s) => ({ shipping: { ...s.shipping, ...data } })),
  setPayment: (data) => set((s) => ({ payment: { ...s.payment, ...data } })),
  setOrderId: (orderId) => set({ orderId }),
  reset: () =>
    set({ step: 1, shipping: { ...emptyShipping }, payment: { ...emptyPayment }, orderId: null }),
}))
