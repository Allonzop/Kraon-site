import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLanguage();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Enhanced floating geometric elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-16 h-16 border border-primary/30 rotate-45"
        animate={{ 
          y: [0, -20, 0],
          rotate: [45, 90, 45],
          x: [0, 10, 0]
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
          scale: [1, 1.2, 1],
          rotate: [0, 360, 0]
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
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.5, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 4
        }}
      />
      
      {/* Additional floating elements */}
      <motion.div 
        className="absolute top-1/3 left-1/2 w-6 h-6 bg-accent/30 rounded-full"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 15, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 left-1/3 w-10 h-10 border-2 border-primary/20 rounded-full"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      <motion.div 
        className="absolute top-3/4 right-1/6 w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full"
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.4, 1, 0.4],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 5
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {t("hero.headline").split(" ").map((word, index, array) => {
            const isLastPart = index >= array.length - 2;
            return (
              <motion.span 
                key={index} 
                className={isLastPart ? "gradient-text" : ""}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {word}{" "}
              </motion.span>
            );
          })}
        </motion.h1>
        
        <motion.p 
          className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          whileInView={{ scale: [1, 1.02, 1] }}
          viewport={{ once: true }}
        >
          {t("hero.subtext")}
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all glow-blue relative overflow-hidden group"
              data-testid="button-get-proposal"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">{t("hero.cta.proposal")}</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              onClick={() => scrollToSection("work")}
              variant="outline"
              className="glass border border-border hover:border-primary text-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all relative overflow-hidden group"
              data-testid="button-see-work"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">{t("hero.cta.work")}</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
