import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function useLocalizedPath(path: string) {
  const locale = useLocale();
  const pathname = usePathname();

  const isLocalized = pathname.startsWith(`/${locale}/`);

  return isLocalized ? `/${locale}${path}` : `/${locale}${path}`;
}
