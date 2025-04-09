import { ForgotPasswordForm } from "@/components/ForgotPasswordForm/ForgotPasswordForm";
import Logo from "@/components/Logo/Logo";
import { getAuthTranslations } from "@/hooks/translations/getAuthTranslations";

export default async function SignInPage() {
  const translations = await getAuthTranslations();

  return (
    <div
      className="bg-[url('https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F34d185b152e5cb7a746c658d71361ebe.cdn.bubble.io%2Ff1711649243631x804749048951855400%2F660498fa04983c094291533d_hero-section-bg-image-home-v1-techflow-x-webflow-template.jpg?w=3072&h=&auto=compress&dpr=1&fit=max')] 
    bg-cover w-full min-h-screen bg-center"
    >
      <main className="font-[family-name:var(--font-geist-sans)] flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <section className="flex items-center justify-center w-full flex-col gap-5">
          <Logo width={150} height={60} />
          <ForgotPasswordForm translations={translations} />
        </section>
      </main>
    </div>
  );
}
