import Header from "@/components/layout/Header/Header";
import { Hero } from "./components/Hero";
import { PainPoints } from "./components/PainPoints";
import { Pillars } from "./components/Pillars";
import { Integrations } from "./components/Integrations";
import { AiSignals } from "./components/AiSignals";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#030A27] text-white font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Pillars />
        <Integrations />
        <AiSignals />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
