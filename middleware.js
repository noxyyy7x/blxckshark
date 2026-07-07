import { NextResponse } from 'next/server'

// Routes admin.blxckshark.com traffic to the /admin section internally,
// so visitors see clean URLs like admin.blxckshark.com/orders instead of
// admin.blxckshark.com/admin/orders. The main domain (blxckshark.com) is
// completely unaffected and continues serving the normal storefront.
export function middleware(request) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-')

  if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
