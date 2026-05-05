import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  })
  const { login, loginPending, loginError, register, registerPending, registerError } = useAuth()

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'login') {
      login({ email: form.email, password: form.password })
    } else {
      register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      })
    }
  }

  const error = mode === 'login' ? loginError : registerError
  const pending = mode === 'login' ? loginPending : registerPending

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600">ShopApp</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-500 mt-1">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName" type="text" required
                  value={form.firstName} onChange={set('firstName')}
                  placeholder="John"
                  className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName" type="text" required
                  value={form.lastName} onChange={set('lastName')}
                  placeholder="Doe"
                  className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email" type="email" required
              value={form.email} onChange={set('email')}
              placeholder="you@example.com"
              className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password" type="password" required minLength={6}
              value={form.password} onChange={set('password')}
              placeholder="••••••••"
              className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="phone" type="tel"
                value={form.phone} onChange={set('phone')}
                placeholder="555-0100"
                className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error.response?.data?.message || error.message || 'Something went wrong'}
            </div>
          )}

          {mode === 'login' && (
            <p className="text-xs text-gray-400">
              Demo accounts: bob@example.com, carol@example.com, alice@example.com
            </p>
          )}

          <button
            type="submit" disabled={pending}
            className="w-full min-h-[44px] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  )
}
