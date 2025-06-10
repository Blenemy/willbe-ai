import { NextRequest, NextResponse } from "next/server";
import { ADMINS_ONLY, ALL_ROLES } from "@/types/Roles";

const protectedRoutes: Record<string, string[]> = {
  "/dashboard/home": ALL_ROLES,
  "/dashboard/lead-generation/account-scenarios": ALL_ROLES,
  "/dashboard/lead-generation/lead-scenarios": ALL_ROLES,
  "/dashboard/messages/scenario-list": ALL_ROLES,
  "/dashboard/messages/message-structures": ALL_ROLES,
  "/dashboard/data/account-list": ALL_ROLES,
  "/dashboard/analytics": ALL_ROLES,
  "/dashboard/company-settings": ALL_ROLES,
  "/dashboard/users": ADMINS_ONLY,
  "/dashboard/profile": ALL_ROLES,
};

export function checkUserAccess(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;
  const userRole = req.cookies.get("userRole")?.value;
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";

  const normalizedPath = pathname.replace(/^\/(en|es)/, "");

  if (normalizedPath.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
  }

  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (normalizedPath.startsWith(route) && !allowedRoles.includes(userRole!)) {
      if (normalizedPath !== "/dashboard/home") {
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard/home`, req.url)
        );
      }
      return null;
    }
  }

  return null;
}
