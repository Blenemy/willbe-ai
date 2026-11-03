import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarTranslations } from "@/hooks/translations/useSidebarTranslations";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarTranslations = await getSidebarTranslations();

  return (
    <SidebarProvider>
      <AppSidebar translations={sidebarTranslations} />
      <SidebarInset className="bg-slate-100 min-h-screen font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-1 flex-col py-6 pr-6">
          <div className="bg-white rounded-xl shadow-sm p-6 flex-1">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
