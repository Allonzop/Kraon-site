import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/assets/logo.png" 
              alt="KRAON Logo" 
              className="w-8 h-8 mr-3 object-contain ring-1 ring-white/10 rounded-sm"
              width="32"
              height="32"
              loading="lazy"
              decoding="async"
              data-testid="img-logo-footer"
            />
            <span className="text-xl font-bold text-foreground">KRAON</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-muted-foreground mb-2">{t("footer.tagline")}</p>
            <p className="text-sm text-muted-foreground">{t("footer.rights")}</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
