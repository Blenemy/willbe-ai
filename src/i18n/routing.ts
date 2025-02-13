import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "de"],

  defaultLocale: "en",
  pathnames: {
    "/contact": {
      en: "/contact-me",
      fr: "/contactez-moi",
      de: "/kontaktiere-mich",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
