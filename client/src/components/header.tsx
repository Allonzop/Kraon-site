import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

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
    { name: t("nav.about"), id: "about" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
              className="w-8 h-8 md:w-10 md:h-10 mr-3 object-contain ring-1 ring-white/10 rounded-sm"
              width="32"
              height="32"
              loading="eager"
              decoding="async"
              data-testid="img-logo"
            />
            <span className="text-xl font-bold text-foreground">KRAON</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  data-testid={`nav-${item.id}`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded"
                data-testid="language-toggle"
                title={language === "en" ? "Switch to French" : "Passer en anglais"}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
              
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:glow-blue"
                data-testid="button-consultation"
              >
                {t("nav.consultation")}
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground hover:text-primary p-2"
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`nav-mobile-${item.id}`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="language-toggle-mobile"
              >
                <Globe className="w-4 h-4" />
                <span>{language === "en" ? "Français" : "English"}</span>
              </button>
              
              <Button
                onClick={() => scrollToSection("contact")}
                className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-consultation-mobile"
              >
                {t("nav.consultation")}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
