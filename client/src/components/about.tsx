import { motion } from "framer-motion";

const trustBadges = [
  { value: "5+", label: "Years Experience" },
  { value: "400%", label: "Avg ROAS Increase" },
  { value: "<24h", label: "Response Time" }
];

const teamMembers = [
  { name: "Sarah Chen", role: "Strategy Director", gradient: "from-primary to-accent" },
  { name: "Marcus Rivera", role: "Performance Lead", gradient: "from-accent to-primary" },
  { name: "Emma Thompson", role: "Creative Director", gradient: "from-primary to-secondary" },
  { name: "Alex Kumar", role: "Analytics Specialist", gradient: "from-secondary to-accent" }
];

export default function About() {
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
              About <span className="gradient-text">KRAON</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We're a premium digital marketing agency exclusively focused on ambitious SMEs. 
              Our data-driven approach and cutting-edge strategies have helped hundreds of businesses 
              scale from startup to market leader. We don't just run campaigns—we build growth engines.
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
