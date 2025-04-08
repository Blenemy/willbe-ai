import { AppSidebar } from "@/components/app-sidebar";
import { getSidebarTranslations } from "@/hooks/translations/useSidebarTranslations";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarTranslations = await getSidebarTranslations();

  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex">
      <AppSidebar translations={sidebarTranslations} />
      <div className="flex flex-1">{children}</div>
    </main>
  );
}
