import { NextRequest, NextResponse } from "next/server";

const SS_KEY_USER_ID = "userId";
const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  const meId = request.cookies.get(SS_KEY_USER_ID)?.value;
  const isProtectedPath = request.nextUrl.pathname !== LOGIN_PATH;

  if (isProtectedPath && !meId) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|register).*)",
  ],
};
