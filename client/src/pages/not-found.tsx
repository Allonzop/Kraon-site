import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center hero-bg overflow-hidden relative px-4">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <motion.div
        className="relative z-10 text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-8xl sm:text-9xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          {language === "fr" ? "Page introuvable" : "Page not found"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === "fr"
            ? "La page que vous cherchez n'existe pas ou a été déplacée."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold glow-blue">
            <Home className="w-4 h-4 mr-2" />
            {language === "fr" ? "Retour à l'accueil" : "Back home"}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
