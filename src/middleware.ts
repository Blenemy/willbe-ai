import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
// import { ADMINS_ONLY, SUPER_ADMIN_ONLY, UserRoles } from "./types/Roles";
// import jwt from "jsonwebtoken";

const protectedRoutes = ["/dashboard"];
const locales = ["en", "es"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;
  // let role: UserRoles | "member" = "member";

  // if (token) {
  //   try {
  //     const decoded = jwt.decode(token) as { role?: UserRoles };

  //     console.log(decoded);

  //     role = decoded?.role ?? "member";
  //     // console.log(`Decoded role: ${role}`);
  //   } catch (error) {
  //     // console.error("Invalid token:", error);
  //   }
  // }

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

  // if (
  //   normalizedPath.startsWith("/dashboard/billing") &&
  //   !SUPER_ADMIN_ONLY.includes(role as unknown)
  // ) {
  //   return NextResponse.redirect(new URL(`/${locale}/dashboard/home`, req.url));
  // }

  // if (
  //   normalizedPath.startsWith("/dashboard/profile") &&
  //   !ADMINS_ONLY.includes(role)
  // ) {
  //   return NextResponse.redirect(new URL(`/${locale}/dashboard/home`, req.url));
  // }

  // if (
  //   normalizedPath.startsWith("/dashboard/company-settings") &&
  //   !ADMINS_ONLY.includes(role)
  // ) {
  //   return NextResponse.redirect(new URL(`/${locale}/dashboard/home`, req.url));
  // }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return createMiddleware(routing)(req);
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
