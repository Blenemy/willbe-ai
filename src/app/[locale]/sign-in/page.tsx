import { AuthForm } from "@/components/AuthForm.tsx/AuthForm";
import Logo from "@/components/Logo/Logo";

export default function SignInPage() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <section className="flex items-center justify-center w-full flex-col gap-5">
        <Logo width={150} height={60} />
        <AuthForm defaultMode="sign-in" />
      </section>
    </main>
  );
}
