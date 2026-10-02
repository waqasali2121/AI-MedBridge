'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="flex items-center gap-3 text-primary">
        <span className="material-symbols-outlined text-3xl animate-spin">
          progress_activity
        </span>
        <span className="font-heading font-semibold text-headline-sm">
          Redirecting to MedBridge Clinical Portal...
        </span>
      </div>
    </div>
  )
}
