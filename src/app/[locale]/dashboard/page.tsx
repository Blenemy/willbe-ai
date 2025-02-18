import { AppSidebar } from "@/components/app-sidebar";
import {} from "@/components/ui/breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex min-h-svh w-full">
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </main>
  );
}
