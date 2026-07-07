'use client'

import { useAuth } from '@/context/AuthContext'

export default function AdminHomePage() {
  const { user } = useAuth()

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
        Welcome back
      </h1>
      <p className="font-body mt-2 text-sm text-white/50">
        Pick a section from the sidebar to get started.
      </p>
    </div>
  )
}
