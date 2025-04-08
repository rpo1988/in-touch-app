import { NextRequest, NextResponse } from "next/server";

const USERNAME_KEY = "username";
const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  const username = request.cookies.get(USERNAME_KEY)?.value;
  const isProtectedPath = request.nextUrl.pathname !== LOGIN_PATH;

  if (isProtectedPath && !username) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
