import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const token = await getToken({req});
  const {pathname} = req.nextUrl;
  if(token){
    if(pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/verify')){
      return NextResponse.redirect(new URL('/profile', req.url));   
    }
  }
  if(!token && (pathname.startsWith('/profile'))){
      return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/", "/verify/:path*", "/profile/:path*"],
};
``