import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

// Data will be generated using translations

export default function About() {
  const { t } = useLanguage();

  const trustBadges = [
    { value: t("about.badge1.value"), label: t("about.badge1.label") },
    { value: t("about.badge2.value"), label: t("about.badge2.label") },
    { value: t("about.badge3.value"), label: t("about.badge3.label") }
  ];


  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t("about.title").includes("About") ? (
                <>About <span className="gradient-text">KRAON</span></>
              ) : (
                <><span className="gradient-text">{t("about.title")}</span></>
              )}
            </h2>
            <motion.p 
              className="text-lg lg:text-xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {t("about.description")}
            </motion.p>
          </motion.div>
            
          {/* Trust badges */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                className="text-center glass rounded-2xl p-8 card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                data-testid={`trust-badge-${index}`}
              >
                <motion.div 
                  className="text-4xl lg:text-5xl font-bold gradient-text mb-3"
                  whileHover={{ scale: 1.1 }}
                >
                  {badge.value}
                </motion.div>
                <div className="text-sm lg:text-base text-muted-foreground font-medium">{badge.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
