import { NextRequest, NextResponse } from "next/server";

const ALLOWED_WHEN_AUTHED = ["/workspace", "/templates"];
const ALWAYS_PUBLIC = ["/auth", "/api", "/_next", "/favicon", "/robots", "/sitemap"];

function isAuthed(req: NextRequest): boolean {
  return req.cookies.get("promptops-auth")?.value === "1";
}

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = isAuthed(req);

  // Never intercept static assets, API routes, or auth flow
  if (startsWithAny(pathname, ALWAYS_PUBLIC)) {
    return NextResponse.next();
  }

  if (authed) {
    // Authenticated users can only be in /workspace or /templates
    if (!startsWithAny(pathname, ALLOWED_WHEN_AUTHED)) {
      return NextResponse.redirect(new URL("/workspace", req.url));
    }
  } else {
    // Unauthenticated users cannot access /workspace or /templates
    if (startsWithAny(pathname, ALLOWED_WHEN_AUTHED)) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
