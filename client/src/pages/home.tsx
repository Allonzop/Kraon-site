import ScrollProgress from "@/components/scroll-progress";
import Grain from "@/components/effects/grain";
import ToolsBand from "@/components/effects/tools-band";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Work from "@/components/work";
import LeadMagnetCTA from "@/components/lead-magnet-cta";
import Process from "@/components/process";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import OfferBanner from "@/components/offer-banner";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Grain />
      <Header />
      <main>
        <Hero />
        <Services />
        <ToolsBand />
        <Work />
        <LeadMagnetCTA />
        <Process />
        <Contact />
      </main>
      <Footer />
      <OfferBanner />
    </div>
  );
}
