import { AuthForm } from "@/components/AuthForm/AuthForm";
import { AuthErrorHandler } from "@/components/AuthForm/components/AuthErrorHandler";
import { getAuthTranslations } from "@/hooks/translations/getAuthTranslations";
import bacgroundLogo from "@/assets/auth_logo.png";
import { DemoAccountHint } from "@/components/DemoAccountHint/DemoAccountHint";

export default async function SignInPage() {
  const translations = await getAuthTranslations();

  return (
    <div
      style={{
        backgroundImage: `url(${bacgroundLogo.src})`,
      }}
      className="bg-cover w-full min-h-screen bg-center"
    >
      <main className="font-[family-name:var(--font-geist-sans)] flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <section className="flex items-center justify-center w-full flex-col gap-5">
          <AuthForm defaultMode="sign-in" translations={translations} />
          <DemoAccountHint />
          <AuthErrorHandler />
        </section>
      </main>
    </div>
  );
}
