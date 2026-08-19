import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Tag, X } from "lucide-react";

/**
 * Notification flottante de l'offre de lancement, affichée sur la page
 * d'accueil uniquement.
 *
 * C'est le SEUL point d'entrée depuis le site principal vers la landing /offre
 * (accès volontairement à sens unique : on peut aller de la landing vers le
 * site, mais pas l'inverse — sauf via cette notification). Elle apparaît après
 * un court délai, est refermable, et le choix est mémorisé en localStorage pour
 * ne pas la réafficher à chaque visite.
 */
const STORAGE_KEY = "kraon.offerBanner.dismissed";

export default function OfferBanner() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* localStorage indisponible : on affiche quand même */
    }
    if (dismissed) return;
    const timer = window.setTimeout(() => setVisible(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[55] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
          role="region"
          aria-label="Offre de lancement"
        >
          <div className="glass relative overflow-hidden rounded-2xl border border-primary/25 p-4 shadow-2xl">
            {/* Halo d'ambiance */}
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(61,155,233,0.6), transparent 70%)" }}
              aria-hidden="true"
            />
            <button
              onClick={dismiss}
              aria-label="Fermer la notification"
              className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              data-testid="offer-banner-close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                <Tag className="h-3 w-3" /> Offre de lancement
              </span>
              <p className="mt-2.5 pr-6 text-sm font-semibold leading-snug">
                Votre site professionnel en ligne en 7 jours.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                À partir de 450€ — réservé aux 20 premiers clients.
              </p>
              <Link
                href="/offre"
                onClick={dismiss}
                className="group mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:glow-blue"
                data-testid="offer-banner-link"
              >
                Découvrir l'offre
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
