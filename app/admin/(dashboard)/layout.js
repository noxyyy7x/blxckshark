'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getStaffProfile, ADMIN_SECTIONS } from '@/lib/staff'

export default function AdminLayout({ children }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [staff, setStaff] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/admin/login')
      return
    }
    getStaffProfile(user.id).then((profile) => {
      if (!profile) {
        router.push('/home')
        return
      }
      setStaff(profile)
      setChecked(true)
    })
  }, [user, loading, router])

  if (loading || !checked || !staff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <p className="font-body text-sm text-white/40">Loading admin panel...</p>
      </div>
    )
  }

  const visibleSections = ADMIN_SECTIONS.filter((s) =>
    s.ownerOnly ? staff.is_owner : staff.is_owner || staff.permissions?.[s.key]
  )

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-white/10">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="font-display text-sm font-bold uppercase tracking-tight">BLXCKSHARK</p>
          <p className="font-body text-xs text-white/40">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {visibleSections.map((s) => (
            <a
              key={s.key}
              href={s.href}
              className={`font-body block px-5 py-2.5 text-sm transition-colors ${
                pathname === s.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="font-body text-xs text-white/40">{staff.name}</p>
          <p className="font-body mb-3 text-xs text-white/30">
            {staff.is_owner ? 'Owner' : 'Staff'}
          </p>
          <button
            onClick={async () => { await signOut(); router.push('/home') }}
            className="font-body text-xs text-white/40 underline hover:text-white"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
