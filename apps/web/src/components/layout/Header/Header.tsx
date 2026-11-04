import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo_light.svg";

const NAV_ITEMS = [
  { href: "#leads", key: "leads" },
  { href: "#prospecting", key: "prospecting" },
  { href: "#analytics", key: "analytics" },
  { href: "#ai", key: "ai" },
] as const;

const Header = async () => {
  const t = await getTranslations("homepage.header");
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#030A27]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={`/${locale}`} aria-label="Willbe">
          <Image src={logo} alt="Willbe" width={90} height={36} priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/70 lg:flex">
          {NAV_ITEMS.map(({ href, key }) => (
            <a key={key} href={href} className="transition-colors hover:text-white">
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Button
            asChild
            variant="ghost"
            className="hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Link href={`/${locale}/sign-in`}>{t("log_in")}</Link>
          </Button>
          <Button asChild className="rounded-full bg-white px-5 text-[#030A27] hover:bg-white/90">
            <Link href={`/${locale}/sign-in`}>{t("start")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
