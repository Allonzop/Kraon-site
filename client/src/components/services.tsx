import { motion, useReducedMotion } from "framer-motion";
import { Target, Zap, Search, Users, Palette, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// Services data will be generated using translations

export default function Services() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const services = [
    {
      icon: Target,
      title: t("services.strategy.title"),
      description: t("services.strategy.desc"),
      color: "primary"
    },
    {
      icon: Zap,
      title: t("services.ads.title"),
      description: t("services.ads.desc"),
      color: "accent"
    },
    {
      icon: Search,
      title: t("services.seo.title"),
      description: t("services.seo.desc"),
      color: "primary"
    },
    {
      icon: Users,
      title: t("services.content.title"),
      description: t("services.content.desc"),
      color: "accent"
    },
    {
      icon: Palette,
      title: t("services.design.title"),
      description: t("services.design.desc"),
      color: "primary"
    },
    {
      icon: BarChart3,
      title: t("services.analytics.title"),
      description: t("services.analytics.desc"),
      color: "accent"
    }
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                className="glass rounded-xl p-6 card-hover group cursor-pointer relative overflow-hidden"
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  rotateY: 2,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {/* Animated background effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color === 'primary' ? 'from-primary/5 to-primary/20' : 'from-accent/5 to-accent/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  initial={{ scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1.5, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div 
                  className={`w-12 h-12 ${service.color === 'primary' ? 'bg-primary/20' : 'bg-accent/20'} rounded-lg flex items-center justify-center mb-4 relative z-10`}
                  whileHover={shouldReduceMotion ? { scale: 1.05 } : { 
                    scale: 1.2, 
                    rotate: 360,
                    transition: { duration: 0.5, ease: "easeInOut" }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className={`w-6 h-6 ${service.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors relative z-10"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {service.title}
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground relative z-10"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {service.description}
                </motion.p>
                
                {/* Hover glow effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${service.color === 'primary' ? 'from-primary/0 via-primary/20 to-primary/0' : 'from-accent/0 via-accent/20 to-accent/0'} rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  style={{ zIndex: -1 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
