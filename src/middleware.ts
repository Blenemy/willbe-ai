import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const protectedRoutes = ["/dashboard"];
const locales = ["en", "es"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  const locale =
    req.cookies.get("NEXT_LOCALE")?.value || req.nextUrl.locale || "en";

  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}`));

  if (!hasLocale) {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }

  const normalizedPath = pathname.replace(/^\/(en|es)/, "");

  if (
    protectedRoutes.some((route) => normalizedPath.startsWith(route)) &&
    !token
  ) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return createMiddleware(routing)(req);
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
