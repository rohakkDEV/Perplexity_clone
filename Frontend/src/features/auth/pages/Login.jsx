import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)

  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const submitForm = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    await handleLogin({ email, password })
    setSubmitting(false)
    navigate('/')
  }

  if (!loading && user) return <Navigate to="/" replace />

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Enter your credentials to continue"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-teal-300 hover:text-teal-200">Create one</Link>
        </>
      }
    >
      <form onSubmit={submitForm} className="space-y-4">
        <FormField
          id="email" type="email" label="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required
        />
        <FormField
          id="password" type="password" label="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" required
        />

        {error && (
          <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login