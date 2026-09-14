import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "anm_admin_session";

/**
 * First line of defence for the admin area: anyone without a session cookie
 * is sent to the login page. The cookie itself is verified against the
 * database in the admin layout (src/app/admin/(panel)/layout.tsx).
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  if (!isLogin && !hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname !== "/admin" ? `?next=${encodeURIComponent(pathname + search)}` : "";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
