import { motion } from "framer-motion";
import { Target, Zap, Search, Users, Palette, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import TiltCard from "@/components/effects/tilt-card";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    { icon: Target, title: t("services.strategy.title"), description: t("services.strategy.desc"), color: "primary" },
    { icon: Zap, title: t("services.ads.title"), description: t("services.ads.desc"), color: "accent" },
    { icon: Search, title: t("services.seo.title"), description: t("services.seo.desc"), color: "primary" },
    { icon: Users, title: t("services.content.title"), description: t("services.content.desc"), color: "accent" },
    { icon: Palette, title: t("services.design.title"), description: t("services.design.desc"), color: "primary" },
    { icon: BarChart3, title: t("services.analytics.title"), description: t("services.analytics.desc"), color: "accent" },
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
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isPrimary = service.color === "primary";
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                viewport={{ once: true }}
                data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <TiltCard
                  className="group relative glass rounded-xl p-6 cursor-pointer overflow-hidden h-full transition-shadow duration-300 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
                  max={9}
                >
                  {/* Hover gradient wash */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      isPrimary ? "from-primary/5 to-primary/20" : "from-accent/5 to-accent/20"
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    aria-hidden="true"
                  />

                  <div className="relative z-10">
                    <motion.div
                      className={`w-12 h-12 ${isPrimary ? "bg-primary/20" : "bg-accent/20"} rounded-lg flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.12, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    >
                      <Icon className={`w-6 h-6 ${isPrimary ? "text-primary" : "text-accent"}`} />
                    </motion.div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
