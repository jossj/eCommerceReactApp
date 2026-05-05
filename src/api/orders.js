import api from './axios'

export const createOrderFromCart = (userId, shippingAddress) =>
  api
    .post(`/orders/from-cart/${userId}`, null, { params: { shippingAddress } })
    .then((r) => r.data)

export const getOrdersByUser = (userId) =>
  api.get(`/orders/user/${userId}`).then((r) => r.data)

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data)
