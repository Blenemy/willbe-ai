import { useLocale } from "next-intl";

export function useLocalizedPath(path: string) {
  const locale = useLocale();
  return `/${locale}${path}`;
}
