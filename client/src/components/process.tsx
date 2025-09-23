import { motion } from "framer-motion";
import { Search, Map, Rocket, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

// Steps data will be generated using translations

export default function Process() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t("process.discover.title"),
      description: t("process.discover.desc"),
      timeline: t("process.discover.timeline"),
      color: "primary"
    },
    {
      icon: Map,
      title: t("process.plan.title"),
      description: t("process.plan.desc"),
      timeline: t("process.plan.timeline"),
      color: "accent"
    },
    {
      icon: Rocket,
      title: t("process.execute.title"),
      description: t("process.execute.desc"),
      timeline: t("process.execute.timeline"),
      color: "primary"
    },
    {
      icon: TrendingUp,
      title: t("process.optimize.title"),
      description: t("process.optimize.desc"),
      timeline: t("process.optimize.timeline"),
      color: "accent"
    }
  ];

  return (
    <section id="process" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("process.title").includes("Our") ? (
              <>Our <span className="gradient-text">Process</span></>
            ) : (
              <><span className="gradient-text">{t("process.title")}</span></>
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("process.subtitle")}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile, visible on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 timeline-line transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="text-center relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  data-testid={`process-step-${step.title.toLowerCase()}`}
                >
                  <motion.div 
                    className={`w-16 h-16 ${step.color === 'primary' ? 'bg-primary' : 'bg-accent'} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon className={`w-8 h-8 ${step.color === 'primary' ? 'text-primary-foreground' : 'text-accent-foreground'}`} />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <div className={`text-sm font-medium ${step.color === 'primary' ? 'text-primary' : 'text-accent'}`}>
                    {step.timeline}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
