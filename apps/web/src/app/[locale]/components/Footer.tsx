import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo_light.svg";
import { WILLBE_PRODUCT_URL } from "@/constants/landing";

const PRODUCT_LINKS = [
  { href: "#leads", key: "leads" },
  { href: "#prospecting", key: "prospecting" },
  { href: "#analytics", key: "analytics" },
  { href: "#ai", key: "ai" },
] as const;

export const Footer = async () => {
  const t = await getTranslations("homepage");
  const locale = await getLocale();

  return (
    <footer className="border-t border-white/10 px-4 pb-10 pt-14">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Image src={logo} alt="Willbe" width={90} height={36} />
          <p className="mt-4 max-w-xs text-pretty text-sm text-blue-100/60">
            {t("hero.title_accent")}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">{t("footer.product")}</p>
          <ul className="mt-4 space-y-2 text-sm text-blue-100/60">
            {PRODUCT_LINKS.map(({ href, key }) => (
              <li key={key}>
                <a href={href} className="transition-colors hover:text-white">
                  {t(`header.${key}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">{t("footer.account")}</p>
          <ul className="mt-4 space-y-2 text-sm text-blue-100/60">
            <li>
              <Link href={`/${locale}/sign-in`} className="transition-colors hover:text-white">
                {t("header.log_in")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/sign-in`} className="transition-colors hover:text-white">
                {t("header.start")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-blue-100/40">
        {t("footer.demo_note")}{" "}
        <a
          href={WILLBE_PRODUCT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-100/70 underline-offset-4 hover:underline"
        >
          willbe.ai
        </a>
      </p>
    </footer>
  );
};
