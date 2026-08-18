import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Tag } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { name: t("nav.services"), id: "services" },
    { name: t("nav.work"), id: "work" },
    { name: t("nav.process"), id: "process" },
    { name: t("nav.about"), id: "about" },
    { name: t("nav.contact"), id: "contact" },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Brand */}
          <div>
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center mb-4 group"
              data-testid="footer-logo"
            >
              <img
                src="/assets/logo.png"
                alt="KRAON Logo"
                className="w-8 h-8 mr-3 object-contain ring-1 ring-white/10 rounded-sm transition-transform group-hover:scale-105"
                width="32"
                height="32"
                loading="lazy"
                decoding="async"
              />
              <span className="text-xl font-bold text-foreground">KRAON</span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {t("footer.navTitle")}
            </h3>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`footer-nav-${item.id}`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  href="/audit-gratuit"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  data-testid="footer-nav-audit"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Audit gratuit
                </Link>
              </li>
              <li>
                <Link
                  href="/offre"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  data-testid="footer-nav-offre"
                >
                  <Tag className="h-3.5 w-3.5" /> Offre de lancement
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {t("footer.ctaTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {t("footer.tagline")}
            </p>
            <button
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:glow-blue group"
              data-testid="footer-cta"
            >
              {t("footer.cta")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground text-center md:text-left">{t("footer.rights")}</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link href="/mentions-legales" className="transition-colors hover:text-primary" data-testid="footer-mentions">
              Mentions légales
            </Link>
            <Link href="/cgv" className="transition-colors hover:text-primary" data-testid="footer-cgv">
              CGV
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-primary" data-testid="footer-confidentialite">
              Confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
