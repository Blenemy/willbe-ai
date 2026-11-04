import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo/Logo";
import Link from "next/link";
import { WILLBE_PRODUCT_URL } from "@/constants/landing";

const NAV_ITEMS = [
  { href: "#features", key: "features" },
  { href: "#how-it-works", key: "how_it_works" },
  { href: "#portfolio", key: "portfolio" },
] as const;

const Header = async () => {
  const t = await getTranslations("homepage.header");
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={`/${locale}`} aria-label="Willbe">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#5F5F5F] lg:flex">
          {NAV_ITEMS.map(({ href, key }) => (
            <a key={key} href={href} className="transition-colors hover:text-[#030A27]">
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <a href={WILLBE_PRODUCT_URL} target="_blank" rel="noopener noreferrer">
              {t("real_product")}
              <ArrowUpRight />
            </a>
          </Button>
          <LanguageSwitcher />
          <Button asChild className="bg-[#030A27] hover:bg-[#030A27]/90">
            <Link href={`/${locale}/sign-in`}>{t("sign_in")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
