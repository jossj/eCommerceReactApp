import api from './axios'

export const getCartByUser = (userId) =>
  api.get(`/cart/user/${userId}`).then((r) => r.data)

export const createCart = (userId) =>
  api.post('/cart', { userId }).then((r) => r.data)

export const getCartItems = (cartId) =>
  api.get(`/cartitems/cart/${cartId}`).then((r) => r.data)

export const addCartItem = (item) =>
  api.post('/cartitems', item).then((r) => r.data)

export const updateCartItem = (id, item) =>
  api.put(`/cartitems/${id}`, item).then((r) => r.data)

export const removeCartItem = (id) =>
  api.delete(`/cartitems/${id}`).then((r) => r.data)
