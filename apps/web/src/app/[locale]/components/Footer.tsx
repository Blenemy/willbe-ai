import { getTranslations } from "next-intl/server";
import Logo from "@/components/Logo/Logo";
import { SOURCE_CODE_URL, WILLBE_PRODUCT_URL } from "@/constants/landing";

export const Footer = async () => {
  const t = await getTranslations("homepage.footer");

  return (
    <footer className="border-t border-black/5 bg-white px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[#5F5F5F] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo width={60} height={24} />
          <span>{t("edition")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>
            {t("real")}{" "}
            <a
              href={WILLBE_PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#030A27] underline-offset-4 hover:underline"
            >
              willbe.ai
            </a>
          </span>
          <a
            href={SOURCE_CODE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#030A27] underline-offset-4 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
