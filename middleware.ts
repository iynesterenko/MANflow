import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/profile']
const COOKIE_NAME = process.env.COOKIE_NAME || "";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => path.startsWith(route))


  const token = req.cookies.get(COOKIE_NAME)?.value;
  if(isProtectedRoute && !token){
    return NextResponse.redirect(new URL('/login', req.url))
  }
   if (isProtectedRoute && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next() 
    } catch (error) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  else{
    return NextResponse.next()
  }

}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}