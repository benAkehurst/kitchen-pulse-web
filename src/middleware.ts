import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get('refreshToken')?.value || req.nextUrl.searchParams.get('token');

  if (!token && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/customers/:path*", "/orders/:path*", "/messages/:path*", "/account"],
};
