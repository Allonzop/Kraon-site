import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Gauge } from "lucide-react";

/**
 * Home-page banner driving visitors to the free scorecard tool (/audit-gratuit).
 * Single-goal, high-contrast, sits between the portfolio and the process.
 */
export default function LeadMagnetCTA() {
  const reduce = useReducedMotion();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(122,61,233,0.5), transparent 70%)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(61,155,233,0.5), transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="h-3.5 w-3.5" /> Outil gratuit
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                Votre site <span className="gradient-text">convertit-il</span> vraiment ?
              </h2>
              <p className="mt-3 text-muted-foreground sm:text-lg">
                Faites le test en 60 secondes : obtenez votre score de performance digitale et un plan d'action personnalisé, gratuitement.
              </p>
            </div>

            <Link
              href="/audit-gratuit"
              className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-all hover:glow-blue"
              data-testid="cta-audit-gratuit"
            >
              <Gauge className="h-5 w-5" />
              Lancer mon audit
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
