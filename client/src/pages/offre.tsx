import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  Check,
  X,
  Clock,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Loader2,
  ExternalLink,
  MonitorSmartphone,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Magnetic from "@/components/effects/magnetic";
import Grain from "@/components/effects/grain";
import ScrollProgress from "@/components/scroll-progress";
import { submitNetlifyForm } from "@/lib/netlify-forms";
import { projects } from "@/lib/projects";

// Le hero montre un vrai site que nous avons réalisé (Pepiliya), en desktop + mobile.
import mockupDesktop from "@assets/pepiliya-preview-full.jpg";
import mockupMobile from "@assets/pepiliya-hero.jpg";

/* ------------------------------------------------------------------ *
 * CONFIG DE L'OFFRE — modifiable sans toucher au reste du code.
 * Prix, quota, éléments inclus/exclus, comparatif et FAQ vivent ici.
 * Les valeurs marquées « à confirmer » sont à valider par le porteur.
 * ------------------------------------------------------------------ */
const OFFER = {
  price: 450,
  priceAfter: 650,
  spots: 20, // Affiché en texte uniquement — jamais de compteur décoratif (contrainte légale).
  depositPct: 50,
  deliveryDays: 7,
  revisions: 2, // à confirmer
  included: [
    "Site vitrine complet (jusqu'à 5 pages)", // nombre de pages à confirmer
    "Design sur-mesure, aux couleurs de votre entreprise",
    "Optimisation mobile — pensé pour le téléphone d'abord",
    "Formulaire de contact fonctionnel",
    "Mise en ligne et configuration du nom de domaine",
    "Référencement de base (balises, description, fiche Google)",
    "2 séries de révisions incluses", // à confirmer
    "Livraison sous 7 jours",
  ],
  excluded: [
    "Hébergement annuel du site (à votre charge, quelques euros par mois)",
    "Boutique e-commerce et paiement en ligne",
    "Rédaction de contenus longs (articles, blog)",
    "Shooting photo professionnel",
    "Maintenance mensuelle — proposée en option",
  ],
  // Comparatif marché : uniquement des fourchettes réelles du marché, jamais un prix fictif.
  comparison: [
    { label: "Agence web", value: "1 500 – 2 500€", amount: 2500 },
    { label: "Freelance", value: "800 – 1 200€", amount: 1200 },
    { label: "KRAON — tarif de lancement", value: "450€", amount: 450, highlight: true },
  ],
  sectors: [
    "Commerce / boutique",
    "Restauration / bar",
    "Artisanat / BTP",
    "Santé / bien-être",
    "Beauté / coiffure",
    "Services aux entreprises",
    "Immobilier",
    "Profession libérale",
    "Association",
    "Autre",
  ],
  faq: [
    {
      q: "Pourquoi ce tarif ?",
      a: "C'est un tarif de lancement, réservé aux 20 premiers clients — pas une réduction permanente. Il nous permet de constituer rapidement des références. Ensuite, le tarif passe à 650€.",
    },
    {
      q: "En combien de temps mon site est-il livré ?",
      a: "7 jours, à partir du moment où nous avons reçu vos informations (textes, logo, photos). La maquette est validée avec vous avant toute mise en ligne.",
    },
    {
      q: "Je peux le faire moi-même, non ?",
      a: "Bien sûr, si vous en avez le temps et l'envie. Ici, vous payez un résultat fini, livré vite, et quelqu'un de responsable après la mise en ligne. Votre temps vaut probablement plus que l'écart de prix.",
    },
    {
      q: "Et si le résultat ne me plaît pas ?",
      a: "Vous validez la maquette avant toute mise en ligne, et 2 séries de révisions sont incluses. On avance ensemble jusqu'à ce que ce soit juste.",
    },
    {
      q: "J'ai déjà un site.",
      a: "On peut le moderniser. Demandez une maquette gratuite : vous comparez l'existant et notre proposition, sans engagement.",
    },
    {
      q: "Qui héberge le site ?",
      a: "Nous nous occupons de la mise en ligne et de la configuration du nom de domaine. L'hébergement annuel reste à votre charge (quelques euros par mois) et nous vous orientons vers une solution simple et fiable.", // à confirmer avec le porteur
    },
    {
      q: "Que se passe-t-il après la livraison ?",
      a: "Votre site vous appartient. Nous restons disponibles pour les évolutions et proposons, en option, une formule de maintenance mensuelle (mises à jour, petites modifications, suivi).", // à confirmer
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Instrumentation légère : pousse un événement dans window.dataLayer.
 * S'il n'y a aucun outil d'analytics branché, l'événement s'accumule
 * simplement sans effet — aucune fausse statistique n'est affichée.
 * ------------------------------------------------------------------ */
function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

/** Paramètres de campagne / démo conservés jusqu'à la conversion. */
const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "demo",
] as const;

function useTracking(): Record<string, string> {
  const [params, setParams] = useState<Record<string, string>>({});
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const grabbed: Record<string, string> = {};
    for (const key of TRACKING_KEYS) {
      const value = search.get(key);
      if (value) grabbed[key] = value;
    }
    setParams(grabbed);
  }, []);
  return params;
}

/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Enveloppe d'apparition au scroll (IntersectionObserver via framer-motion). */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
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

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Barre de navigation épurée — se solidifie au scroll.
 * ------------------------------------------------------------------ */
function OfferNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2" data-testid="offer-logo">
          <img
            src="/assets/logo.png"
            alt="KRAON"
            width={32}
            height={32}
            className="h-7 w-7 rounded-sm object-contain ring-1 ring-white/10 sm:h-8 sm:w-8"
            loading="eager"
            decoding="async"
          />
          <span className="text-lg font-bold sm:text-xl">KRAON</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5" /> 20 premiers clients
          </span>
          <a
            href="#commande"
            onClick={() => track("cta_click", { location: "nav", target: "commande" })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:glow-blue sm:px-4"
            data-testid="offer-nav-order"
          >
            Commander — {OFFER.price}€
          </a>
        </div>
      </div>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ *
 * Visuel du hero : cadre navigateur (desktop) + téléphone.
 * ------------------------------------------------------------------ */
function HeroMockup() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="relative mx-auto w-full max-w-lg"
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
    >
      {/* Halo derrière le mockup */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(61,155,233,0.35), transparent 60%), radial-gradient(circle at 80% 80%, rgba(122,61,233,0.30), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Cadre navigateur */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[hsl(0,0%,8%)] shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="ml-3 hidden flex-1 rounded-md bg-white/5 px-3 py-1 text-[10px] text-muted-foreground sm:block">
            votre-entreprise.fr
          </div>
        </div>
        <div className="h-64 overflow-hidden sm:h-80">
          <img
            src={mockupDesktop}
            alt="Exemple de site réalisé par KRAON, affiché dans un navigateur"
            className="h-full w-full object-cover object-top"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Téléphone en superposition */}
      <div className="absolute -bottom-8 -right-3 w-24 rotate-3 sm:-right-6 sm:w-28">
        <div className="overflow-hidden rounded-[1.25rem] border-4 border-[hsl(0,0%,14%)] bg-[hsl(0,0%,8%)] shadow-2xl">
          <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-white/20" />
          <div className="mt-1 h-40 overflow-hidden sm:h-44">
            <img
              src={mockupMobile}
              alt="Le même site en version mobile"
              className="h-full w-full object-cover object-top"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Section preuve : galerie des réalisations réelles.
 * ------------------------------------------------------------------ */
type ProofLink = { href: string; external: boolean; label: string };

function projectLink(p: (typeof projects)[number]): ProofLink {
  if (p.demoPath) return { href: p.demoPath, external: false, label: "Voir la démo" };
  if (p.url) return { href: `https://${p.url}`, external: true, label: "Voir le site" };
  return { href: `/project/${p.id}`, external: true, label: "Voir le projet" };
}

function ProofCard({ p, delay }: { p: (typeof projects)[number]; delay: number }) {
  const link = projectLink(p);
  const image = p.cardImage ?? p.heroImage;
  const Icon = p.icon;

  const inner = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40">
      <div className="relative aspect-[16/10] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`Réalisation KRAON — ${p.title}`}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${p.gradient}`}
          >
            {p.logo ? (
              <img src={p.logo} alt={p.title} className="max-h-10 w-auto opacity-90" loading="lazy" />
            ) : (
              <Icon className="h-10 w-10 text-white/70" />
            )}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          {p.category.fr}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{p.title}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.result.fr}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          {link.label}
          {link.external ? (
            <ExternalLink className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </span>
      </div>
    </div>
  );

  return (
    <Reveal delay={delay} className="h-full">
      {link.external ? (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("proof_click", { project: p.title })}
          className="block h-full"
          data-testid={`proof-${p.id}`}
        >
          {inner}
        </a>
      ) : (
        <Link
          href={link.href}
          onClick={() => track("proof_click", { project: p.title })}
          className="block h-full"
          data-testid={`proof-${p.id}`}
        >
          {inner}
        </Link>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ *
 * Champs de formulaire partagés (thème du site).
 * ------------------------------------------------------------------ */
const fieldClass =
  "form-field w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ *
 * Colonne A — Recevoir ma maquette gratuite.
 * ------------------------------------------------------------------ */
function MaquetteForm({ tracking }: { tracking: Record<string, string> }) {
  const [form, setForm] = useState({ company: "", email: "", phone: "", website: "", sector: "" });
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const ready = form.company && form.email && form.sector && consent && state !== "loading";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setState("loading");
    try {
      const payload = { ...form, consent: "oui", ...tracking };
      if (import.meta.env.PROD) {
        await submitNetlifyForm("maquette", payload);
      } else {
        // Dev local : pas de backend Netlify, on simule un envoi réussi.
        await new Promise((r) => setTimeout(r, 600));
      }
      track("generate_lead", { form: "maquette", sector: form.sector });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Demande envoyée</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Nous préparons votre maquette gratuite et revenons vers vous très vite. Pensez à vérifier vos
            spams.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-4">
      <Field label="Nom de l'entreprise" required>
        <input
          type="text"
          required
          value={form.company}
          onChange={set("company")}
          placeholder="Votre entreprise"
          className={fieldClass}
          data-testid="maquette-company"
        />
      </Field>
      <Field label="Email" required>
        <input
          type="email"
          required
          value={form.email}
          onChange={set("email")}
          placeholder="vous@entreprise.fr"
          className={fieldClass}
          data-testid="maquette-email"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Téléphone">
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="06 12 34 56 78"
            className={fieldClass}
            data-testid="maquette-phone"
          />
        </Field>
        <Field label="Site actuel">
          <input
            type="text"
            value={form.website}
            onChange={set("website")}
            placeholder="Si vous en avez un"
            className={fieldClass}
            data-testid="maquette-website"
          />
        </Field>
      </div>
      <Field label="Secteur d'activité" required>
        <select
          required
          value={form.sector}
          onChange={set("sector")}
          className={`${fieldClass} appearance-none`}
          data-testid="maquette-sector"
        >
          <option value="" disabled>
            Choisir…
          </option>
          {OFFER.sectors.map((s) => (
            <option key={s} value={s} className="bg-background">
              {s}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[hsl(217,91%,60%)]"
          data-testid="maquette-consent"
        />
        J'accepte d'être recontacté(e) par KRAON au sujet de ma demande. Aucune donnée n'est partagée.
      </label>

      {state === "error" && (
        <p className="text-xs text-rose-400">
          Une erreur est survenue. Réessayez, ou écrivez-nous directement.
        </p>
      )}

      <button
        type="submit"
        disabled={!ready}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="maquette-submit"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Recevoir ma maquette gratuite <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ *
 * Colonne B — Commander mon site.
 *
 * NOTE IMPLÉMENTATION : le site est déployé en statique (Netlify Forms,
 * pas de backend en prod). Cette colonne capture donc l'intention de
 * commande, puis un lien de paiement sécurisé (Stripe) est envoyé
 * manuellement. Pour brancher un vrai Stripe Checkout : créer une
 * Netlify Function `create-checkout-session` (clé STRIPE_SECRET_KEY côté
 * serveur), rediriger vers l'URL de session ici, et valider le paiement
 * via le webhook `checkout.session.completed` — jamais via la redirection.
 * ------------------------------------------------------------------ */
function CommandeForm({ tracking }: { tracking: Record<string, string> }) {
  const [form, setForm] = useState({ company: "", email: "", phone: "", sector: "" });
  const [payment, setPayment] = useState<"acompte" | "integral">("acompte");
  const [consent, setConsent] = useState(false);
  const [cgv, setCgv] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const deposit = Math.round((OFFER.price * OFFER.depositPct) / 100);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const ready = form.company && form.email && form.sector && consent && cgv && state !== "loading";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setState("loading");
    track("begin_checkout", { payment_option: payment, value: payment === "acompte" ? deposit : OFFER.price });
    try {
      const payload = {
        ...form,
        payment_option: payment === "acompte" ? `Acompte ${OFFER.depositPct}% (${deposit}€)` : `Intégral (${OFFER.price}€)`,
        consent: "oui",
        cgv: "oui",
        ...tracking,
      };
      if (import.meta.env.PROD) {
        await submitNetlifyForm("commande", payload);
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      track("order_submitted", { payment_option: payment });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex h-full flex-col gap-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Commande enregistrée</h3>
            <p className="text-sm text-muted-foreground">
              Nous vous envoyons sous quelques heures un lien de paiement sécurisé et le récapitulatif.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold">Pour aller vite, préparez :</p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {["Votre logo (si vous en avez un)", "Quelques photos ou visuels", "Vos textes ou les grandes lignes", "L'accès à votre nom de domaine (le cas échéant)"].map(
              (item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-4">
      <Field label="Nom de l'entreprise" required>
        <input type="text" required value={form.company} onChange={set("company")} placeholder="Votre entreprise" className={fieldClass} data-testid="commande-company" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" required>
          <input type="email" required value={form.email} onChange={set("email")} placeholder="vous@entreprise.fr" className={fieldClass} data-testid="commande-email" />
        </Field>
        <Field label="Téléphone">
          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="06 12 34 56 78" className={fieldClass} data-testid="commande-phone" />
        </Field>
      </div>
      <Field label="Secteur d'activité" required>
        <select required value={form.sector} onChange={set("sector")} className={`${fieldClass} appearance-none`} data-testid="commande-sector">
          <option value="" disabled>
            Choisir…
          </option>
          {OFFER.sectors.map((s) => (
            <option key={s} value={s} className="bg-background">
              {s}
            </option>
          ))}
        </select>
      </Field>

      {/* Choix du paiement */}
      <fieldset className="grid gap-3 sm:grid-cols-2">
        {[
          { key: "acompte" as const, title: `Acompte ${OFFER.depositPct}%`, amount: `${deposit}€`, note: "Le solde à la livraison" },
          { key: "integral" as const, title: "Paiement intégral", amount: `${OFFER.price}€`, note: "Réglé en une fois" },
        ].map((opt) => {
          const active = payment === opt.key;
          return (
            <button
              type="button"
              key={opt.key}
              onClick={() => setPayment(opt.key)}
              className={`rounded-xl border p-4 text-left transition-all ${
                active ? "border-primary bg-primary/15" : "border-white/10 bg-white/[0.03] hover:border-primary/50"
              }`}
              data-testid={`commande-payment-${opt.key}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{opt.title}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    active ? "border-primary bg-primary text-white" : "border-white/25 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
              </div>
              <div className="mt-1 text-lg font-bold">{opt.amount}</div>
              <div className="text-xs text-muted-foreground">{opt.note}</div>
            </button>
          );
        })}
      </fieldset>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={cgv} onChange={(e) => setCgv(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(217,91%,60%)]" data-testid="commande-cgv" />
          <span>
            J'accepte les{" "}
            <a href="#mentions" className="text-primary underline">
              conditions générales de vente
            </a>
            .
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(217,91%,60%)]" data-testid="commande-consent" />
          J'accepte d'être recontacté(e) par KRAON au sujet de ma commande.
        </label>
      </div>

      {state === "error" && (
        <p className="text-xs text-rose-400">Une erreur est survenue. Réessayez, ou écrivez-nous directement.</p>
      )}

      <button
        type="submit"
        disabled={!ready}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="commande-submit"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" /> Commander mon site — {OFFER.price}€
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Paiement sécurisé. Nous vous transmettons un lien de règlement après votre demande.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ *
 * Page /offre
 * ------------------------------------------------------------------ */
export default function Offre() {
  const reduce = useReducedMotion();
  const tracking = useTracking();
  const trackedView = useRef(false);

  useEffect(() => {
    const prev = document.title;
    document.title = `Votre site pro en ${OFFER.deliveryDays} jours — ${OFFER.price}€ | KRAON`;
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    if (trackedView.current) return;
    trackedView.current = true;
    track("view_offer", { price: OFFER.price });
  }, []);

  const problems = useMemo(
    () => [
      "Votre site date d'il y a des années et vous n'osez plus le montrer.",
      "Sur mobile, c'est illisible — alors que la majorité de vos visiteurs sont sur téléphone.",
      "Vous avez commencé trois fois, et jamais fini.",
    ],
    [],
  );

  // Animation d'entrée du hero (cascade titre → sous-titre → CTA).
  const heroItem = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  const maxAmount = Math.max(...OFFER.comparison.map((c) => c.amount));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Grain />
      <OfferNav />

      <main>
        {/* ---------------- HERO ---------------- */}
        <section
          id="top"
          className="hero-bg relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-32"
        >
          <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <motion.div {...heroItem(0)}>
                <SectionEyebrow>
                  <Sparkles className="h-3.5 w-3.5" /> Tarif de lancement — {OFFER.spots} premiers clients
                </SectionEyebrow>
              </motion.div>

              <motion.h1
                {...heroItem(0.12)}
                className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Votre site professionnel, en ligne en{" "}
                <span className="gradient-text">{OFFER.deliveryDays} jours</span>.
              </motion.h1>

              <motion.p
                {...heroItem(0.24)}
                className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground lg:mx-0"
              >
                Vous ne rédigez rien, vous ne configurez rien. Vous validez, nous livrons. À partir de{" "}
                <span className="font-semibold text-foreground">{OFFER.price}€</span>.
              </motion.p>

              <motion.div
                {...heroItem(0.36)}
                className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
              >
                <Magnetic>
                  <a
                    href="#maquette"
                    onClick={() => track("cta_click", { location: "hero", target: "maquette" })}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-all glow-blue sm:w-auto"
                    data-testid="hero-cta-maquette"
                  >
                    Voir ma maquette gratuite
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#commande"
                    onClick={() => track("cta_click", { location: "hero", target: "commande" })}
                    className="glass inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-7 py-3.5 text-base font-semibold transition-all hover:border-primary sm:w-auto"
                    data-testid="hero-cta-commande"
                  >
                    Commander maintenant — {OFFER.price}€
                  </a>
                </Magnetic>
              </motion.div>

              <motion.div
                {...heroItem(0.48)}
                className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> Livré en {OFFER.deliveryDays} jours
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-primary" /> Optimisé mobile
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary" /> Maquette validée avant paiement
                </span>
              </motion.div>
            </div>

            <HeroMockup />
          </div>
        </section>

        {/* ---------------- PROBLÈME ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                Un site qui ne travaille pas pour vous,{" "}
                <span className="gradient-text">c'est un client qui passe son chemin</span>.
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {problems.map((text, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <span className="text-4xl font-bold text-primary/30">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-3 text-muted-foreground">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- PREUVE ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <SectionEyebrow>
                <MonitorSmartphone className="h-3.5 w-3.5" /> Nos réalisations
              </SectionEyebrow>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                Des sites réels, <span className="gradient-text">déjà en ligne</span>.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Plutôt que des promesses, regardez ce que nous livrons. Cliquez pour explorer chaque projet.
              </p>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ProofCard key={p.id} p={p} delay={(i % 3) * 0.08} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CE QUI EST INCLUS ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ce que couvrent vos <span className="gradient-text">{OFFER.price}€</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Tout est dit, sans mauvaise surprise. Ce qui est inclus, et ce qui ne l'est pas.
              </p>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-transparent p-6 sm:p-7">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <Check className="h-5 w-5 text-primary" /> Inclus
                  </h3>
                  <ul className="space-y-3">
                    {OFFER.included.map((item) => (
                      <li key={item} className="flex gap-3 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                    <X className="h-5 w-5" /> Non inclus
                  </h3>
                  <ul className="space-y-3">
                    {OFFER.excluded.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5">
                          <X className="h-3.5 w-3.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-muted-foreground">
                    Cette transparence évite les litiges — et vous savez exactement ce que vous payez.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- PRIX & ANCRAGE ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Le même résultat, <span className="gradient-text">sans le tarif d'agence</span>
              </h2>
            </Reveal>

            <Reveal>
              <div className="glass rounded-3xl p-6 sm:p-9">
                <div className="space-y-5">
                  {OFFER.comparison.map((row, i) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className={row.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}>
                          {row.label}
                        </span>
                        <span className={`font-semibold tabular-nums ${row.highlight ? "text-primary" : ""}`}>
                          {row.value}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className={`h-full rounded-full ${
                            row.highlight ? "bg-gradient-to-r from-primary to-accent" : "bg-white/20"
                          }`}
                          initial={reduce ? false : { width: 0 }}
                          whileInView={{ width: `${Math.max((row.amount / maxAmount) * 100, 8)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                  <div>
                    <div className="text-sm text-muted-foreground">Tarif de lancement</div>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{OFFER.price}€</span>
                      <span className="text-sm text-muted-foreground">
                        puis {OFFER.priceAfter}€ après les {OFFER.spots} premiers clients
                      </span>
                    </div>
                  </div>
                  <Magnetic>
                    <a
                      href="#commande"
                      onClick={() => track("cta_click", { location: "pricing", target: "commande" })}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-all hover:glow-blue"
                      data-testid="pricing-cta"
                    >
                      J'en profite <ArrowRight className="h-5 w-5" />
                    </a>
                  </Magnetic>
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Offre de lancement réservée aux {OFFER.spots} premiers clients. Fourchettes marché données à
                  titre indicatif.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Vos questions, nos réponses</h2>
            </Reveal>
            <Reveal>
              <Accordion type="single" collapsible className="w-full">
                {OFFER.faq.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-5"
                  >
                    <AccordionTrigger className="text-left text-base hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* ---------------- DOUBLE CONVERSION ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                Deux façons de <span className="gradient-text">démarrer</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Vous préférez voir avant de vous décider ? Recevez une maquette gratuite. Déjà convaincu ?
                Lancez votre site tout de suite.
              </p>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div id="maquette" className="glass flex h-full flex-col rounded-3xl p-6 scroll-mt-24 sm:p-8">
                  <div className="mb-5">
                    <SectionEyebrow>Sans engagement</SectionEyebrow>
                    <h3 className="mt-3 text-xl font-bold">Recevoir ma maquette gratuite</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      On vous montre à quoi ressemblerait votre site, gratuitement.
                    </p>
                  </div>
                  <MaquetteForm tracking={tracking} />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div
                  id="commande"
                  className="relative flex h-full flex-col rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/[0.08] to-transparent p-6 scroll-mt-24 sm:p-8"
                >
                  <div className="mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      <ShieldCheck className="h-3.5 w-3.5" /> Le plus rapide
                    </span>
                    <h3 className="mt-3 text-xl font-bold">Commander mon site — {OFFER.price}€</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      On démarre dès réception de vos informations. Livraison en {OFFER.deliveryDays} jours.
                    </p>
                  </div>
                  <CommandeForm tracking={tracking} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer id="mentions" className="border-t border-border bg-muted/30 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="KRAON"
              width={32}
              height={32}
              className="h-8 w-8 rounded-sm object-contain ring-1 ring-white/10"
              loading="lazy"
              decoding="async"
            />
            <span className="text-lg font-bold">KRAON</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {/* Pages légales : à brancher sur le contenu fourni par le porteur. */}
            <a href="#mentions" className="transition-colors hover:text-primary">
              Mentions légales
            </a>
            <a href="#mentions" className="transition-colors hover:text-primary">
              CGV
            </a>
            <a href="#mentions" className="transition-colors hover:text-primary">
              Confidentialité
            </a>
            <Link href="/" className="transition-colors hover:text-primary">
              Retour au site
            </Link>
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} KRAON. Offre de lancement réservée aux {OFFER.spots} premiers clients.
        </p>
      </footer>
    </div>
  );
}
