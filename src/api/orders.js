import api from './axios'

export const createOrder = (order) =>
  api.post('/orders', order).then((r) => r.data)

export const addOrderItem = (item) =>
  api.post('/orderitems', item).then((r) => r.data)

export const getOrdersByUser = (userId) =>
  api.get(`/orders/user/${userId}`).then((r) => r.data)

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data)
