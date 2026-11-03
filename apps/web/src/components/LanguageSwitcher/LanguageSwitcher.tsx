"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { LANGUAGES } from "@/constants/languages";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const changeLanguage = (locale: string) => {
    router.push(`/${locale}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 p-2 border rounded-md">
        <Image
          src={currentLanguage.flag}
          alt={currentLanguage.label}
          width={24}
          height={16}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center space-x-2"
          >
            <Image src={lang.flag} alt={lang.label} width={24} height={16} />
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
