import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Mail, MapPin, MessageCircle, Instagram, Check } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useLanguage } from "@/lib/i18n";
import { ABOUT, type Localized } from "@/lib/about-me";

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Portrait compact avec repli automatique si la photo n'a pas été déposée. */
function Portrait() {
  const { language } = useLanguage();
  const L = (v: Localized) => v[language];
  const [failed, setFailed] = useState(false);
  const initial = ABOUT.name.trim().charAt(0).toUpperCase() || "K";

  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <div
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[1.75rem] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(61,155,233,0.35), transparent 60%), radial-gradient(circle at 80% 80%, rgba(122,61,233,0.30), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        {ABOUT.photo && !failed ? (
          <img
            src={ABOUT.photo}
            alt={`${ABOUT.name} — ${L(ABOUT.role)}`}
            className="aspect-[4/5] w-full object-cover"
            loading="eager"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold">
              {initial}
            </div>
            <p className="px-6 text-center text-xs text-muted-foreground">
              {language === "en" ? "Add your photo at" : "Photo à déposer dans"}{" "}
              <code>public/media/portrait.jpg</code>
            </p>
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
        <div className="text-sm font-semibold">{ABOUT.name}</div>
        <div className="text-xs text-muted-foreground">{L(ABOUT.role)}</div>
      </div>
    </div>
  );
}

export default function AboutMe() {
  const reduce = useReducedMotion();
  const { language } = useLanguage();
  const L = (v: Localized) => v[language];
  const isEn = language === "en";

  useEffect(() => {
    const prev = document.title;
    document.title = isEn ? "About — KRAON" : "À propos — KRAON";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, [isEn]);

  const socialLinks = [
    ABOUT.socials.email && { href: `mailto:${ABOUT.socials.email}`, icon: Mail, label: "E-mail", external: false },
    ABOUT.socials.whatsapp && { href: ABOUT.socials.whatsapp, icon: MessageCircle, label: "WhatsApp", external: true },
    ABOUT.socials.instagram && { href: ABOUT.socials.instagram, icon: Instagram, label: "Instagram", external: true },
  ].filter(Boolean) as { href: string; icon: typeof Mail; label: string; external: boolean }[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="hero-bg relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
          <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden="true" />
          {/* Aurora blobs — cohérence avec le hero du site */}
          {!reduce && (
            <>
              <motion.div
                className="absolute -top-24 -left-20 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[120px]"
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute -bottom-32 -right-16 h-[30rem] w-[30rem] rounded-full bg-accent/15 blur-[130px]"
                animate={{ x: [0, -60, 0], y: [0, -20, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                aria-hidden="true"
              />
            </>
          )}

          <div className="relative mx-auto grid max-w-6xl gap-x-12 gap-y-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Bloc A — juste l'accroche : passe AVANT la photo sur mobile */}
            <div className="lg:col-start-1 lg:row-start-1">
              <motion.span
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <MapPin className="h-3.5 w-3.5" /> {ABOUT.location}
              </motion.span>

              <motion.h1
                className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
                style={{ textWrap: "balance" } as React.CSSProperties}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              >
                {L(ABOUT.headline)} <span className="gradient-text">{L(ABOUT.headlineAccent)}</span>.
              </motion.h1>

              <motion.p
                className="mt-4 text-lg font-medium text-foreground/90"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              >
                {L(ABOUT.tagline)}
              </motion.p>
            </div>

            {/* Photo — après l'accroche sur mobile ; colonne droite centrée sur desktop */}
            <motion.div
              className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center"
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              <Portrait />
            </motion.div>

            {/* Bloc B — le reste : après la photo sur mobile */}
            <div className="lg:col-start-1 lg:row-start-2">
              <motion.div
                className="space-y-3 text-muted-foreground"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              >
                {ABOUT.intro.map((p, i) => (
                  <p key={i}>{L(p)}</p>
                ))}
              </motion.div>

              <motion.div
                className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              >
                <Link
                  href="/offre"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all glow-blue"
                >
                  {isEn ? "See the offer" : "Voir l'offre"}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-2">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.external ? "_blank" : undefined}
                        rel={s.external ? "noopener noreferrer" : undefined}
                        aria-label={s.label}
                        className="glass inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
                      >
                        <s.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------------- COMMENT ÇA SE PASSE ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mb-12 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                {isEn ? "How " : "Comment "}
                <span className="gradient-text">{isEn ? "it works" : "ça se passe"}</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                {isEn ? "Simple, transparent, no jargon." : "Simple, transparent, sans jargon."}
              </p>
            </Reveal>
            <div className="space-y-4">
              {ABOUT.steps.map((step, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-primary/40 sm:p-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{L(step.title)}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{L(step.desc)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CE QUE ÇA CHANGE POUR VOUS ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mb-12 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                {isEn ? "What it " : "Ce que ça "}
                <span className="gradient-text">{isEn ? "changes for you" : "change pour vous"}</span>
              </h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {ABOUT.reasons.map((r, i) => (
                <Reveal key={i} delay={(i % 2) * 0.08}>
                  <div className="flex h-full gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-primary/40">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{L(r.title)}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{L(r.desc)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CTA FINAL ---------------- */}
        <section className="px-4 pb-24 pt-4 sm:px-6">
          <Reveal className="mx-auto max-w-4xl">
            <div className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(122,61,233,0.5), transparent 70%)" }}
                aria-hidden="true"
              />
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                {isEn ? "Shall we build your site together?" : "On construit votre site ensemble ?"}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                {isEn
                  ? "Get a free mockup of your future site, with no commitment."
                  : "Recevez une maquette gratuite de votre futur site, sans engagement."}
              </p>
              <Link
                href="/offre"
                className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-all hover:glow-blue"
              >
                {isEn ? "See the offer" : "Découvrir l'offre"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
