import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Zap, Search, Users, Palette, BarChart3, RotateCw, ArrowLeft, Check, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  isPrimary: boolean;
}

/**
 * Carte de service « flippable » : un clic / tap (ou Entrée/Espace au clavier)
 * la retourne pour révéler le bénéfice concret pour le client au dos.
 */
function FlipServiceCard({ service, flipHint, backLabel }: { service: Service; flipHint: string; backLabel: string }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  const Icon = service.icon;
  const { isPrimary } = service;

  const toggle = () => setFlipped((f) => !f);

  const face = "glass absolute inset-0 flex h-full flex-col overflow-hidden rounded-xl p-6";
  const backface = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as React.CSSProperties;

  return (
    <div className="h-full min-h-[240px]" style={{ perspective: "1200px" }}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${service.title} — ${flipHint}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className="relative h-full cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        style={{
          transformStyle: "preserve-3d",
          transition: `transform ${reduce ? 0 : 600}ms cubic-bezier(0.16,1,0.3,1)`,
          transform: flipped ? "rotateY(180deg)" : "none",
        }}
      >
        {/* FRONT */}
        <div className={`group ${face}`} style={backface}>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              isPrimary ? "from-primary/5 to-primary/20" : "from-accent/5 to-accent/20"
            } opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full flex-col">
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                isPrimary ? "bg-primary/20" : "bg-accent/20"
              }`}
            >
              <Icon className={`h-6 w-6 ${isPrimary ? "text-primary" : "text-accent"}`} />
            </div>
            <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">{service.title}</h3>
            <p className="text-muted-foreground">{service.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-medium text-primary/80">
              <RotateCw className="h-3.5 w-3.5" /> {flipHint}
            </span>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`${face} border border-primary/25 bg-gradient-to-br from-primary/10 to-accent/10`}
          style={{ ...backface, transform: "rotateY(180deg)" }}
        >
          <div className="flex h-full flex-col">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
              <Check className="h-5 w-5" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">{flipHint}</div>
            <p className="mt-2 text-lg font-medium leading-snug">{service.value}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { t, language } = useLanguage();
  const backLabel = language === "en" ? "Back" : "Retour";

  const services: Service[] = [
    { icon: Target, title: t("services.strategy.title"), description: t("services.strategy.desc"), value: t("services.strategy.value"), isPrimary: true },
    { icon: Zap, title: t("services.ads.title"), description: t("services.ads.desc"), value: t("services.ads.value"), isPrimary: false },
    { icon: Search, title: t("services.seo.title"), description: t("services.seo.desc"), value: t("services.seo.value"), isPrimary: true },
    { icon: Users, title: t("services.content.title"), description: t("services.content.desc"), value: t("services.content.value"), isPrimary: false },
    { icon: Palette, title: t("services.design.title"), description: t("services.design.desc"), value: t("services.design.value"), isPrimary: true },
    { icon: BarChart3, title: t("services.analytics.title"), description: t("services.analytics.desc"), value: t("services.analytics.value"), isPrimary: false },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("services.title").includes("Strategic") ? (
              <>Strategic <span className="gradient-text">Services</span></>
            ) : (
              <>{t("services.title").split(" ").slice(0, -2).join(" ")} <span className="gradient-text">{t("services.title").split(" ").slice(-2).join(" ")}</span></>
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("services.subtitle")}</p>
          <p className="mt-3 text-sm text-muted-foreground/80">
            {language === "en" ? "Tap a card to see what it means for you." : "Cliquez sur une carte pour voir ce que ça vous apporte."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              viewport={{ once: true }}
              data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <FlipServiceCard service={service} flipHint={t("services.flipHint")} backLabel={backLabel} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
