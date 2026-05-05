import api from './axios'

export const getUserByEmail = (email) =>
  api.get(`/users/email/${encodeURIComponent(email)}`).then((r) => r.data)

export const register = (userData) =>
  api.post('/users', userData).then((r) => r.data)
