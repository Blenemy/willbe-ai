import { NextRequest, NextResponse } from "next/server";

const salesNavigatorProtectedRoutes = [
  "/dashboard/account-generation/create-account-scenarios",
  "/dashboard/lead-generation/create-lead-scenarios",
];

export function checkSalesNavigatorAccess(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const salesNavigator = req.cookies.get("salesNavigator")?.value;
  const locale = req.cookies.get("NEXT_LOCALE")?.value ?? "en";

  const normalizedPath = pathname.replace(/^\/(en|es|fr)/, "");

  if (
    salesNavigatorProtectedRoutes.some((route) =>
      normalizedPath.startsWith(route)
    ) &&
    salesNavigator !== "true"
  ) {
    const url = new URL(`/${locale}/dashboard/home`, req.url);
    url.searchParams.set("error", "sales_navigator_required");
    return NextResponse.redirect(url);
  }

  return null;
}
