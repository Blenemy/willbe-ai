import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { AuthLink } from "./components/AuthLink";
import Logo from "@/components/Logo/Logo";

const Header = async () => {
  const t = await getTranslations("homepage.header");

  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex gap-2 items-center xmd:gap-8">
        <Logo />
        <p>{t("title")}</p>
      </div>

      <div className="flex gap-2 xmd:gap-8">
        <AuthLink label={t("sign_in")} variant="sign-in" />

        <Button className="hidden xmd:block" variant="default">
          {t("talk_to_sales")}
        </Button>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;
