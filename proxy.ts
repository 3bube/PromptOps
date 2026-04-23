import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto");

  if (proto === "http") {
    const host = request.headers.get("host");
    return NextResponse.redirect(`https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`, {
      status: 301,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/data|favicon.ico).*)"],
};
