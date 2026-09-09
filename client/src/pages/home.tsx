import { useEffect } from "react";

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
import { useLanguage } from "@/lib/i18n";

/**
 * Titre et méta-description de l'accueil, par langue.
 * La version française reste celle du HTML statique (client/index.html) :
 * c'est elle que les moteurs de recherche indexent. On ne bascule en anglais
 * que lorsqu'un visiteur change de langue, pour que l'onglet et le partage de
 * lien suivent la langue affichée.
 */
const PAGE_SEO = {
  fr: {
    title: "KRAON — Création de sites internet pour artisans",
    description:
      "KRAON crée des sites internet sur-mesure pour les artisans : une vitrine professionnelle, rapide et soignée, qui met votre savoir-faire en valeur et vous apporte des clients.",
  },
  en: {
    title: "KRAON — Websites for skilled artisans",
    description:
      "KRAON builds bespoke websites for craftspeople: a professional, fast and polished showcase that highlights your craft and brings you clients.",
  },
} as const;

export default function Home() {
  const { language } = useLanguage();

  useEffect(() => {
    const seo = PAGE_SEO[language];
    document.title = seo.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", seo.description);
  }, [language]);

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
