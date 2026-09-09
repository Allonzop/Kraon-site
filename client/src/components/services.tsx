import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Palette,
  RefreshCw,
  Search,
  Workflow,
  Bot,
  Plug,
  Globe,
  Cpu,
  RotateCw,
  ArrowLeft,
  Check,
  type LucideIcon,
} from "lucide-react";
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
            <span
              className={`mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-medium ${
                isPrimary ? "text-primary/80" : "text-accent/80"
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" /> {flipHint}
            </span>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`${face} border ${
            isPrimary ? "border-primary/25" : "border-accent/25"
          } bg-gradient-to-br from-primary/10 to-accent/10`}
          style={{ ...backface, transform: "rotateY(180deg)" }}
        >
          <div className="flex h-full flex-col">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
              <Check className="h-5 w-5" />
            </div>
            <div className={`text-xs font-semibold uppercase tracking-wider ${isPrimary ? "text-primary" : "text-accent"}`}>
              {flipHint}
            </div>
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

/** Un pôle d'expertise : un titre de groupe puis ses trois cartes. */
function SpecialtyGroup({
  icon: GroupIcon,
  label,
  services,
  flipHint,
  backLabel,
  accent,
  indexOffset,
}: {
  icon: LucideIcon;
  label: string;
  services: Service[];
  flipHint: string;
  backLabel: string;
  accent: "primary" | "accent";
  indexOffset: number;
}) {
  return (
    <div>
      <motion.div
        className="mb-6 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            accent === "primary" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
          }`}
        >
          <GroupIcon className="h-5 w-5" />
        </span>
        <h3 className="text-xl font-bold sm:text-2xl">{label}</h3>
        <span
          className={`hidden h-px flex-1 sm:block ${
            accent === "primary"
              ? "bg-gradient-to-r from-primary/40 to-transparent"
              : "bg-gradient-to-r from-accent/40 to-transparent"
          }`}
          aria-hidden="true"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            className="h-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (indexOffset + index) * 0.06, ease: "easeOut" }}
            viewport={{ once: true }}
            data-testid={`service-${service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          >
            <FlipServiceCard service={service} flipHint={flipHint} backLabel={backLabel} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const { t, language } = useLanguage();
  const backLabel = language === "en" ? "Back" : "Retour";
  const flipHint = t("services.flipHint");

  const web: Service[] = [
    { icon: Palette, title: t("services.web1.title"), description: t("services.web1.desc"), value: t("services.web1.value"), isPrimary: true },
    { icon: RefreshCw, title: t("services.web2.title"), description: t("services.web2.desc"), value: t("services.web2.value"), isPrimary: true },
    { icon: Search, title: t("services.web3.title"), description: t("services.web3.desc"), value: t("services.web3.value"), isPrimary: true },
  ];

  const ai: Service[] = [
    { icon: Workflow, title: t("services.ai1.title"), description: t("services.ai1.desc"), value: t("services.ai1.value"), isPrimary: false },
    { icon: Bot, title: t("services.ai2.title"), description: t("services.ai2.desc"), value: t("services.ai2.value"), isPrimary: false },
    { icon: Plug, title: t("services.ai3.title"), description: t("services.ai3.desc"), value: t("services.ai3.value"), isPrimary: false },
  ];

  return (
    <section id="services" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {t("services.title")} <span className="gradient-text">{t("services.titleAccent")}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">{t("services.subtitle")}</p>
          <p className="mt-3 text-sm text-muted-foreground/80">
            {language === "en"
              ? "Tap a card to see what it means for you."
              : "Cliquez sur une carte pour voir ce que ça vous apporte."}
          </p>
        </motion.div>

        <div className="space-y-16">
          <SpecialtyGroup
            icon={Globe}
            label={t("services.group.web")}
            services={web}
            flipHint={flipHint}
            backLabel={backLabel}
            accent="primary"
            indexOffset={0}
          />
          <SpecialtyGroup
            icon={Cpu}
            label={t("services.group.ai")}
            services={ai}
            flipHint={flipHint}
            backLabel={backLabel}
            accent="accent"
            indexOffset={3}
          />
        </div>
      </div>
    </section>
  );
}
