import { AppSidebar } from "@/components/app-sidebar";
import { getSidebarTranslations } from "@/hooks/translations/useSidebarTranslations";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarTranslations = await getSidebarTranslations();

  return (
    <main className="flex min-h-screen font-[family-name:var(--font-geist-sans)] bg-slate-100">
      <AppSidebar translations={sidebarTranslations} />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>
      </div>
    </main>
  );
}
