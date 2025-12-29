import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedUserId } from "./action/auth/getuserid";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authResponse = await getAuthenticatedUserId();

  if (pathname.startsWith("/dashboard")) {
    if (!authResponse.status) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.includes("/login")) {
    if (authResponse.status) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
