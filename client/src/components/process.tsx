import { motion } from "framer-motion";
import { Search, Map, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Deep-dive analysis of your business, market, and opportunities",
    timeline: "Week 1-2",
    color: "primary"
  },
  {
    icon: Map,
    title: "Plan",
    description: "Strategic roadmap with clear milestones and KPI targets",
    timeline: "Week 2-3",
    color: "accent"
  },
  {
    icon: Rocket,
    title: "Execute",
    description: "Implementation of campaigns with real-time monitoring",
    timeline: "Week 4+",
    color: "primary"
  },
  {
    icon: TrendingUp,
    title: "Optimize",
    description: "Continuous improvement based on data and performance insights",
    timeline: "Ongoing",
    color: "accent"
  }
];

export default function Process() {
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
            Our <span className="gradient-text">Process</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that delivers consistent results for our clients
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
