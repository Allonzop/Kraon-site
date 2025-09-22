import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating geometric elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-16 h-16 border border-primary/30 rotate-45"
        animate={{ 
          y: [0, -20, 0],
          rotate: [45, 90, 45]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-12 h-12 border border-accent/30"
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div 
        className="absolute top-1/2 right-1/3 w-8 h-8 bg-primary/20 rounded-full"
        animate={{ 
          y: [0, -25, 0],
          opacity: [0.2, 0.8, 0.2]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 4
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Premium Digital Marketing for{" "}
          <span className="gradient-text">Ambitious SMEs</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Strategy, performance, and design — tailored to your growth.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={() => scrollToSection("contact")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 glow-blue"
            data-testid="button-get-proposal"
          >
            Get a Proposal
          </Button>
          <Button
            onClick={() => scrollToSection("work")}
            variant="outline"
            className="glass border border-border hover:border-primary text-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
            data-testid="button-see-work"
          >
            See Work
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
