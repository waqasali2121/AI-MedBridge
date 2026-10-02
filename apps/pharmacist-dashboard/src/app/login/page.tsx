'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { authService } from '@/services/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('pharmacist@medbridge.com')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await authService.login(email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Masthead */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-primary text-on-primary items-center justify-center font-bold text-2xl shadow-lg mb-2">
            <span className="material-symbols-outlined text-secondary-container text-3xl">
              health_and_safety
            </span>
          </div>
          <h1 className="text-headline-lg font-heading font-extrabold text-primary tracking-tight">
            MedBridge
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-body-md font-heading font-semibold text-on-surface-variant">
              Clinical Pharmacist Verification Portal
            </span>
            <Badge variant="teal">v1.0</Badge>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 shadow-md space-y-6">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="text-headline-sm font-heading font-bold text-on-surface">
              Sign In to Your Shift
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Access pending prescriptions & bilingual handover controls
            </p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3.5 rounded-xl border border-error/30 text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email Address"
              type="email"
              placeholder="pharmacist@medbridge.com"
              icon="mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon="lock"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-outline-variant text-secondary focus:ring-secondary"
                />
                <span>Remember this terminal</span>
              </label>
              <a href="#" className="text-secondary font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon="login"
              loading={loading}
            >
              Sign In to Clinical Portal
            </Button>
          </form>

          {/* Demo Hint Banner */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-secondary">
              <span className="material-symbols-outlined text-base">info</span>
              <span>Demo Pharmacist Credentials</span>
            </div>
            <p className="text-body-sm font-mono text-on-surface">
              Email: <strong>pharmacist@medbridge.com</strong>
            </p>
            <p className="text-body-sm font-mono text-on-surface">
              Password: <strong>demo1234</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-on-surface-variant font-medium">
          Protected by 256-bit GxP encryption & HIPAA audit tracking.
        </p>
      </div>
    </main>
  )
}
