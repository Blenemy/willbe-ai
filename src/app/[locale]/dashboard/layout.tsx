import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex">
      <AppSidebar />
      <div className="flex flex-1">{children}</div>
    </main>
  );
}
