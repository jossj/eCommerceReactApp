import api from './axios'

export const getProducts = () => api.get('/products').then((r) => r.data)
export const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data)
