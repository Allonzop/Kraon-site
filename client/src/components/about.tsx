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

  const teamMembers = [
    { name: t("about.team1.name"), role: t("about.team1.role"), gradient: "from-primary to-accent" },
    { name: t("about.team2.name"), role: t("about.team2.role"), gradient: "from-accent to-primary" },
    { name: t("about.team3.name"), role: t("about.team3.role"), gradient: "from-primary to-secondary" },
    { name: t("about.team4.name"), role: t("about.team4.role"), gradient: "from-secondary to-accent" }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {t("about.title").includes("About") ? (
                <>About <span className="gradient-text">KRAON</span></>
              ) : (
                <><span className="gradient-text">{t("about.title")}</span></>
              )}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("about.description")}
            </p>
            
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-6">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`trust-badge-${index}`}
                >
                  <div className="text-3xl font-bold gradient-text mb-1">{badge.value}</div>
                  <div className="text-sm text-muted-foreground">{badge.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="glass rounded-xl p-6 text-center card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                data-testid={`team-member-${index}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${member.gradient} rounded-full mx-auto mb-4`} />
                <div className="font-medium text-foreground">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
