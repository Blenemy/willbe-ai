import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { checkSalesNavigatorAccess } from "./middleware/guards/checkSalesNavigatorAccess";

const locales = ["en", "es", "fr"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";

  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}`));

  if (!hasLocale && pathname !== "/") {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }

  const salesCheck = checkSalesNavigatorAccess(req);
  if (salesCheck) return salesCheck;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return createMiddleware(routing)(req);
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
