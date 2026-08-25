import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import Magnetic from "@/components/effects/magnetic";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: t("nav.services"), id: "services" },
    { name: t("nav.work"), id: "work" },
    { name: t("nav.process"), id: "process" },
    { name: t("nav.contact"), id: "contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border/50" 
          : "bg-white/5 backdrop-blur-md border-b border-white/10"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div 
            className="flex items-center cursor-pointer"
            onClick={() => scrollToSection("hero")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="button-logo"
          >
            <img 
              src="/assets/logo.png" 
              alt="KRAON Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 object-contain ring-1 ring-white/10 rounded-sm"
              width="32"
              height="32"
              loading="eager"
              decoding="async"
              data-testid="img-logo"
            />
            <span className="text-lg sm:text-xl font-bold text-foreground">KRAON</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <div className="flex items-center space-x-4 xl:space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/10 text-sm xl:text-base"
                  data-testid={`nav-${item.id}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Language Toggle */}
              <motion.button
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/10"
                data-testid="language-toggle"
                title={language === "en" ? "Switch to French" : "Passer en anglais"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </motion.button>
              
              <Magnetic strength={0.5}>
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:glow-blue text-sm xl:text-base"
                  data-testid="button-consultation"
                >
                  {t("nav.consultation")}
                </Button>
              </Magnetic>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground hover:text-primary p-2 rounded-md hover:bg-primary/10"
            data-testid="button-mobile-menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pt-3 pb-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  data-testid={`nav-mobile-${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Mobile Language Toggle */}
              <motion.button
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className="flex items-center space-x-2 w-full text-left px-4 py-3 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                data-testid="language-toggle-mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Globe className="w-4 h-4" />
                <span>{language === "en" ? "Français" : "English"}</span>
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navItems.length + 1) * 0.1 }}
              >
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold rounded-lg transition-all hover:scale-105 glow-blue"
                  data-testid="button-consultation-mobile"
                >
                  {t("nav.consultation")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
