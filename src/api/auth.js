import api from './axios'

export const login = (credentials) =>
  api.post('/users/login', credentials).then((r) => r.data)

export const register = (userData) =>
  api.post('/users/register', userData).then((r) => r.data)

export const getUser = (id) =>
  api.get(`/users/${id}`).then((r) => r.data)
