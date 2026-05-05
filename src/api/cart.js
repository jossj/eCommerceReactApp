import api from './axios'

export const getCart = (userId) =>
  api.get(`/cart/user/${userId}`).then((r) => r.data)

export const addItemToCart = (userId, item) =>
  api.post(`/cart/user/${userId}/items`, item).then((r) => r.data)

export const updateCartItem = (userId, itemId, quantity) =>
  api.put(`/cart/user/${userId}/items/${itemId}`, null, { params: { quantity } }).then((r) => r.data)

export const removeCartItem = (userId, itemId) =>
  api.delete(`/cart/user/${userId}/items/${itemId}`).then((r) => r.data)

export const clearUserCart = (userId) =>
  api.delete(`/cart/user/${userId}/clear`).then((r) => r.data)
