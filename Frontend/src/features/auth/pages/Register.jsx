import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const error = useSelector(state => state.auth.error)
  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const submitForm = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    await handleRegister({ username, email, password })
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <AuthLayout eyebrow="Almost there" title="Check your inbox" subtitle="One more step">
        <p className="text-sm leading-relaxed text-white/60">
          We sent a verification link to <span className="text-white">{email}</span>. Click it to activate your account, then come back to sign in.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 w-full rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5"
        >
          Go to login
        </button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Register with your username, email, and password"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-teal-300 hover:text-teal-200">Sign in</Link>
        </>
      }
    >
      <form onSubmit={submitForm} className="space-y-4">
        <FormField
          id="username" type="text" label="Username"
          value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username" required
        />
        <FormField
          id="email" type="email" label="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required
        />
        <FormField
          id="password" type="password" label="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters" required minLength={6}
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
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register