export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 h-9 w-48 animate-pulse rounded-md bg-white/[0.06]" />
        <div className="mb-8 flex gap-3 border-b border-white/10 pb-6">
          <div className="h-9 w-24 animate-pulse rounded-md bg-white/[0.06]" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-white/[0.06]" />
          <div className="ml-auto h-9 w-32 animate-pulse rounded-md bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
