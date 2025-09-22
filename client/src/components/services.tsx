import { motion } from "framer-motion";
import { Target, Zap, Search, Users, Palette, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Target,
    title: "Strategy",
    description: "Data-driven growth strategies that align with your business objectives",
    color: "primary"
  },
  {
    icon: Zap,
    title: "Paid Ads",
    description: "High-performance campaigns across Google, Meta, and LinkedIn",
    color: "accent"
  },
  {
    icon: Search,
    title: "SEO",
    description: "Organic visibility optimization for sustainable long-term growth",
    color: "primary"
  },
  {
    icon: Users,
    title: "Content & Social",
    description: "Engaging content strategies that build communities and drive conversions",
    color: "accent"
  },
  {
    icon: Palette,
    title: "Web Design",
    description: "Premium websites that convert visitors into customers",
    color: "primary"
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Advanced tracking and insights to optimize every touchpoint",
    color: "accent"
  }
];

export default function Services() {
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
            Strategic <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions designed to accelerate your business growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                className="glass rounded-xl p-6 card-hover group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`w-12 h-12 ${service.color === 'primary' ? 'bg-primary/20' : 'bg-accent/20'} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${service.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
