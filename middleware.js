import { NextResponse } from 'next/server'

// Routes admin.blxckshark.com and athlete.blxckshark.com traffic to their
// respective internal sections, so visitors see clean URLs like
// admin.blxckshark.com/orders or athlete.blxckshark.com/ instead of the
// full internal path. The main domain (blxckshark.com) is completely
// unaffected and continues serving the normal storefront.
export function middleware(request) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-')
  const isAthleteSubdomain = hostname.startsWith('athlete.') || hostname.startsWith('athlete-')

  if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (isAthleteSubdomain && !url.pathname.startsWith('/athlete-signup')) {
    url.pathname = `/athlete-signup${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
