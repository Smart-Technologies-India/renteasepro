import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const idCookie = request.cookies.get("id");
  const id = idCookie?.value.toString();

  const refirectToDashboard = () =>
    NextResponse.redirect(new URL("/dashboard", request.url));
  const refirectToLogin = () =>
    NextResponse.redirect(new URL("/", request.url));

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!id) {
      return refirectToLogin();
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
