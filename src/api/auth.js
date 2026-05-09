import api from './axios'

export const login = ({ email, password }) =>
  api.post('/auth/login', { email, password }).then((r) => r.data)

export const register = (userData) =>
  api.post('/auth/register', userData).then((r) => r.data)
