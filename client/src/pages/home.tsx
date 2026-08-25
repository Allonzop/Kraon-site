import ScrollProgress from "@/components/scroll-progress";
import Grain from "@/components/effects/grain";
import Marquee from "@/components/effects/marquee";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Work from "@/components/work";
import LeadMagnetCTA from "@/components/lead-magnet-cta";
import Process from "@/components/process";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import OfferBanner from "@/components/offer-banner";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();

  const marqueeItems = [
    t("services.strategy.title"),
    t("services.ads.title"),
    t("services.seo.title"),
    t("services.content.title"),
    t("services.design.title"),
    t("services.analytics.title"),
    "Performance",
    "ROI",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Grain />
      <Header />
      <main>
        <Hero />
        <Services />
        <Marquee items={marqueeItems} />
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
