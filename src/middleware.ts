import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLogged = !!req.auth;
  const { nextUrl } = req;

  const isPublicRoute = ["/", "/login", "/about", "/blog", "/features", "/pricing", "/privacy", "/terms", "/presentation", "/dossier-full.html"].some(path => nextUrl.pathname === path || nextUrl.pathname.startsWith("/blog/"));
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuthRoute) return NextResponse.next();

  if (!isLogged && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|presentation).*)"],
};
