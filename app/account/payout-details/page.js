'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import BrandLoader from '@/components/BrandLoader'
import { BankIcon } from '@/components/Icons'

export default function PayoutDetailsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAthlete, setIsAthlete] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [payoutType, setPayoutType] = useState('uk_bank')
  const [accountName, setAccountName] = useState('')
  const [sortCode, setSortCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [iban, setIban] = useState('')
  const [swiftBic, setSwiftBic] = useState('')
  const [country, setCountry] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return

    async function load() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'athlete') {
        setPageLoading(false)
        return
      }
      setIsAthlete(true)

      const { data: details } = await supabase
        .from('athlete_payout_details')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (details) {
        setPayoutType(details.payout_type)
        setAccountName(details.account_name || '')
        setSortCode(details.sort_code || '')
        setAccountNumber(details.account_number || '')
        setIban(details.iban || '')
        setSwiftBic(details.swift_bic || '')
        setCountry(details.country || '')
      }
      setPageLoading(false)
    }
    load()
  }, [user])

  async function handleSave(e) {
    e.preventDefault()
    setError('')

    if (!accountName.trim()) {
      setError('Account holder name is required.')
      return
    }
    if (payoutType === 'uk_bank' && (!sortCode.trim() || !accountNumber.trim())) {
      setError('Sort code and account number are required.')
      return
    }
    if (payoutType === 'international' && (!iban.trim() || !swiftBic.trim() || !country.trim())) {
      setError('IBAN, SWIFT/BIC, and country are required.')
      return
    }

    setSaving(true)
    const { error: saveError } = await supabase.from('athlete_payout_details').upsert({
      user_id: user.id,
      payout_type: payoutType,
      account_name: accountName.trim(),
      sort_code: payoutType === 'uk_bank' ? sortCode.trim() : null,
      account_number: payoutType === 'uk_bank' ? accountNumber.trim() : null,
      iban: payoutType === 'international' ? iban.trim() : null,
      swift_bic: payoutType === 'international' ? swiftBic.trim() : null,
      country: payoutType === 'international' ? country.trim() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading || !user || pageLoading) {
    return (
      <>
        <NotificationBar />
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-[#0a0a0a] text-white">
          <BrandLoader />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-md px-6 py-12">
          <div className="mb-2 flex items-center gap-2.5">
            <BankIcon className="h-5 w-5 text-white/50" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Payout Details</h1>
          </div>

          {!isAthlete ? (
            <p className="font-body text-sm text-white/40">
              This page is only available for BLXCKSHARK Athletes.
            </p>
          ) : (
            <>
              <p className="font-body mb-8 text-sm text-white/50">
                Where we send your cashout payments. Only you and BLXCKSHARK staff can view these
                details — never shared publicly.
              </p>

              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setPayoutType('uk_bank')}
                  className={`font-body flex-1 rounded-md border py-2.5 text-sm font-semibold ${
                    payoutType === 'uk_bank' ? 'border-white bg-white text-black' : 'border-white/20 text-white/60'
                  }`}
                >
                  UK Bank
                </button>
                <button
                  onClick={() => setPayoutType('international')}
                  className={`font-body flex-1 rounded-md border py-2.5 text-sm font-semibold ${
                    payoutType === 'international' ? 'border-white bg-white text-black' : 'border-white/20 text-white/60'
                  }`}
                >
                  International
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Account holder name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                />

                {payoutType === 'uk_bank' ? (
                  <>
                    <input
                      type="text"
                      placeholder="Sort code (e.g. 12-34-56)"
                      value={sortCode}
                      onChange={(e) => setSortCode(e.target.value)}
                      className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="IBAN"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                    />
                    <input
                      type="text"
                      placeholder="SWIFT / BIC"
                      value={swiftBic}
                      onChange={(e) => setSwiftBic(e.target.value)}
                      className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                    />
                  </>
                )}

                {error && <p className="font-body text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Payout Details'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
