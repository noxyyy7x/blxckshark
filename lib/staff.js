import { supabase } from './supabaseClient'

// Fetches the staff_users row for a given auth user id, or null if they're
// not a staff member. Used to gate admin panel access and permissions.
export async function getStaffProfile(authId) {
  if (!authId) return null
  const { data, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('auth_id', authId)
    .maybeSingle()

  if (error) {
    console.error('getStaffProfile error:', error)
  }

  return data
}

// Logs a staff action for the audit trail. Call this after any meaningful
// admin action (promoting an athlete, changing an order, etc.)
export async function logActivity(staffId, action, details = {}) {
  await supabase.from('activity_logs').insert({ staff_id: staffId, action, details })
}

export const ADMIN_SECTIONS = [
  { key: 'orders', label: 'Orders', href: '/admin/orders' },
  { key: 'products', label: 'Products', href: '/admin/products' },
  { key: 'reviews', label: 'Reviews', href: '/admin/reviews' },
  { key: 'messages', label: 'Broadcast Messages', href: '/admin/messages' },
  { key: 'athletes', label: 'Athletes', href: '/admin/athletes' },
  { key: 'discounts', label: 'Discount Codes', href: '/admin/discounts' },
  { key: 'cashouts', label: 'Cashout Requests', href: '/admin/cashouts' },
  { key: 'leaderboard', label: 'XP Leaderboard', href: '/admin/leaderboard' },
  { key: 'chat', label: 'Live Chat', href: '/admin/chat' },
  { key: 'attendance', label: 'Staff Attendance', href: '/admin/attendance' },
  { key: 'logs', label: 'Activity Logs', href: '/admin/logs' },
  { key: 'staff', label: 'Staff Management', href: '/admin/staff', ownerOnly: true },
]
