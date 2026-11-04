import Header from "@/components/layout/Header/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Steps } from "./components/Steps";
import { PortfolioEdition } from "./components/PortfolioEdition";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#030A27] font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main>
        <Hero />
        <Features />
        <Steps />
        <PortfolioEdition />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
