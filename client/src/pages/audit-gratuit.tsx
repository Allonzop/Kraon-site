import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, animate, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Check, Sparkles, Loader2, RotateCcw } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { submitNetlifyForm } from "@/lib/netlify-forms";

type DimKey = "design" | "acquisition" | "conversion" | "content" | "data";

const DIMENSIONS: Record<DimKey, string> = {
  design: "Site & expérience",
  acquisition: "Visibilité & trafic",
  conversion: "Conversion",
  content: "Contenu & SEO",
  data: "Data & pilotage",
};

interface Question {
  id: string;
  dimension: DimKey;
  question: string;
  options: { label: string; value: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    dimension: "design",
    question: "Votre site actuel, c'est plutôt…",
    options: [
      { label: "Un site sur-mesure, récent et soigné", value: 100 },
      { label: "Un template correct mais générique", value: 55 },
      { label: "Vieux, lent ou bricolé", value: 20 },
      { label: "Je n'ai pas (encore) de site", value: 0 },
    ],
  },
  {
    id: "q2",
    dimension: "design",
    question: "Sur mobile, l'expérience est…",
    options: [
      { label: "Parfaitement fluide et lisible", value: 100 },
      { label: "Correcte, sans plus", value: 60 },
      { label: "Difficile à utiliser", value: 25 },
      { label: "Aucune idée, je n'ai jamais regardé", value: 35 },
    ],
  },
  {
    id: "q3",
    dimension: "acquisition",
    question: "D'où vient l'essentiel de vos visiteurs ?",
    options: [
      { label: "Plusieurs canaux que je maîtrise", value: 100 },
      { label: "Surtout le bouche-à-oreille", value: 45 },
      { label: "Presque personne ne me trouve", value: 15 },
      { label: "Je ne sais pas vraiment", value: 30 },
    ],
  },
  {
    id: "q4",
    dimension: "content",
    question: "Publiez-vous du contenu (SEO, articles, réseaux) ?",
    options: [
      { label: "Oui, avec une vraie stratégie", value: 100 },
      { label: "De temps en temps, sans plan", value: 50 },
      { label: "Jamais", value: 15 },
    ],
  },
  {
    id: "q5",
    dimension: "conversion",
    question: "Vos appels à l'action (devis, RDV, achat) sont…",
    options: [
      { label: "Clairs et pensés pour convertir", value: 100 },
      { label: "Présents mais basiques", value: 55 },
      { label: "Absents ou peu visibles", value: 15 },
    ],
  },
  {
    id: "q6",
    dimension: "conversion",
    question: "Savez-vous combien de visiteurs deviennent clients ?",
    options: [
      { label: "Oui, je suis mon taux de conversion", value: 100 },
      { label: "Vaguement, au ressenti", value: 45 },
      { label: "Pas du tout", value: 15 },
    ],
  },
  {
    id: "q7",
    dimension: "data",
    question: "Mesurez-vous vos performances ?",
    options: [
      { label: "Oui, tableaux de bord suivis régulièrement", value: 100 },
      { label: "Analytics installé mais jamais consulté", value: 50 },
      { label: "Aucune mesure", value: 15 },
    ],
  },
];

const RECOS: Record<DimKey, string> = {
  design:
    "Un site sur-mesure, rapide et pensé mobile-first transforme la première impression — et le taux de conversion qui va avec.",
  acquisition:
    "Diversifiez vos sources de trafic (SEO, publicité, réseaux) pour ne plus dépendre du hasard ni du bouche-à-oreille.",
  conversion:
    "Des appels à l'action clairs et un parcours sans friction peuvent multiplier vos demandes entrantes à trafic égal.",
  content:
    "Un contenu régulier et optimisé installe votre autorité et attire durablement un trafic qualifié et gratuit.",
  data:
    "Sans mesure, pas d'optimisation. Un tableau de bord clair révèle exactement où vous perdez des clients.",
};

function band(score: number): { label: string; desc: string; color: string } {
  if (score >= 75)
    return {
      label: "Solide",
      desc: "Votre présence digitale est déjà performante. Il reste à optimiser les derniers leviers pour aller chercher plus.",
      color: "#34d399",
    };
  if (score >= 50)
    return {
      label: "Bon potentiel",
      desc: "De bonnes bases, mais des leviers de croissance clairs restent encore inexploités.",
      color: "#3d9be9",
    };
  if (score >= 25)
    return {
      label: "À renforcer",
      desc: "Votre digital laisse passer des opportunités. Quelques chantiers prioritaires peuvent tout changer.",
      color: "#f5b544",
    };
  return {
    label: "Fragile",
    desc: "Votre présence digitale ne travaille pas encore pour vous — c'est aussi un fort potentiel à activer.",
    color: "#fb6f7a",
  };
}

function computeScores(answers: Record<string, number>) {
  const byDim: Record<DimKey, number[]> = { design: [], acquisition: [], conversion: [], content: [], data: [] };
  for (const q of QUESTIONS) {
    if (answers[q.id] !== undefined) byDim[q.dimension].push(answers[q.id]);
  }
  const perDim = {} as Record<DimKey, number>;
  (Object.keys(byDim) as DimKey[]).forEach((d) => {
    const arr = byDim[d];
    perDim[d] = arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  });
  const dims = Object.values(perDim);
  const global = Math.round(dims.reduce((a, b) => a + b, 0) / dims.length);
  return { perDim, global };
}

/* ------------------------------------------------------------------ */

function Gauge({ score, color }: { score: number; color: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? score : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(score);
      return;
    }
    const controls = animate(0, score, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [score, reduce]);

  const r = 84;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - display / 100);

  return (
    <div className="relative h-56 w-56 shrink-0">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d9be9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold tabular-nums">{Math.round(display)}</div>
        <div className="text-sm text-muted-foreground">/ 100</div>
        <div className="mt-1 text-sm font-semibold" style={{ color }}>
          {band(score).label}
        </div>
      </div>
    </div>
  );
}

function DimensionBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const reduce = useReducedMotion();
  const color = value >= 70 ? "#34d399" : value >= 40 ? "#3d9be9" : "#f5b544";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function AuditGratuit() {
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<"quiz" | "result">("quiz");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    const prev = document.title;
    document.title = "Audit digital gratuit — KRAON";
    return () => {
      document.title = prev;
    };
  }, []);

  const total = QUESTIONS.length;
  const { perDim, global } = useMemo(() => computeScores(answers), [answers]);
  const current = QUESTIONS[step];

  const select = (value: number) => {
    setAnswers((a) => ({ ...a, [current.id]: value }));
    window.setTimeout(
      () => {
        if (step < total - 1) setStep((s) => s + 1);
        else setStage("result");
      },
      reduce ? 0 : 240,
    );
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setStage("quiz");
    setEmail("");
    setConsent(false);
    setSubmitState("idle");
  };

  const lowestDims = (Object.keys(perDim) as DimKey[])
    .sort((a, b) => perDim[a] - perDim[b])
    .slice(0, 2);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent || submitState === "loading") return;
    setSubmitState("loading");
    try {
      if (import.meta.env.PROD) {
        // Production : Netlify Forms (formulaire "audit" déclaré dans index.html).
        await submitNetlifyForm("audit", {
          email,
          source: "audit-gratuit",
          score: global,
          details: JSON.stringify(perDim),
          consent: "oui",
        });
        setSubmitState("done");
      } else {
        // Dev local : API Express.
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "audit-gratuit", score: global, details: perDim, consent: true }),
        });
        const json = await res.json();
        setSubmitState(json.success ? "done" : "error");
      }
    } catch {
      setSubmitState("error");
    }
  };

  const verdict = band(global);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="hero-bg">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
          {/* Intro */}
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Outil gratuit
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl" style={{ textWrap: "balance" } as React.CSSProperties}>
              Votre présence digitale <span className="gradient-text">travaille-t-elle</span> pour vous ?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              7 questions, 60 secondes. Obtenez votre score de performance digitale et un plan d'action personnalisé — sans engagement.
            </p>
          </div>

          {/* Interactive card */}
          <div className="glass rounded-3xl p-6 sm:p-9">
            <AnimatePresence mode="wait">
              {stage === "quiz" ? (
                <motion.div
                  key="quiz"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                >
                  {/* Progress */}
                  <div className="mb-7">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Question {step + 1} / {total}
                      </span>
                      <span className="uppercase tracking-wider">{DIMENSIONS[current.dimension]}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        animate={{ width: `${((step + (answers[current.id] !== undefined ? 1 : 0)) / total) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={reduce ? false : { opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? undefined : { opacity: 0, x: -24 }}
                      transition={{ duration: 0.28 }}
                    >
                      <h2 className="mb-6 text-xl font-semibold sm:text-2xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                        {current.question}
                      </h2>
                      <div className="flex flex-col gap-3">
                        {current.options.map((opt) => {
                          const active = answers[current.id] === opt.value;
                          return (
                            <button
                              key={opt.label}
                              onClick={() => select(opt.value)}
                              className={`group flex items-center justify-between rounded-xl border px-4 py-4 text-left transition-all ${
                                active
                                  ? "border-primary bg-primary/15"
                                  : "border-white/10 bg-white/[0.03] hover:border-primary/50 hover:bg-white/[0.06]"
                              }`}
                            >
                              <span className="text-sm sm:text-base">{opt.label}</span>
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  active ? "border-primary bg-primary text-white" : "border-white/20 text-transparent group-hover:border-primary/60"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" /> Précédent
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Score + verdict */}
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
                    <Gauge score={global} color={verdict.color} />
                    <div className="text-center sm:text-left">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Votre score digital</div>
                      <div className="mt-1 text-2xl font-bold" style={{ color: verdict.color }}>
                        {verdict.label}
                      </div>
                      <p className="mt-2 text-muted-foreground">{verdict.desc}</p>
                    </div>
                  </div>

                  {/* Dimension breakdown */}
                  <div className="mt-9 grid gap-4 sm:grid-cols-2">
                    {(Object.keys(DIMENSIONS) as DimKey[]).map((d, i) => (
                      <DimensionBar key={d} label={DIMENSIONS[d]} value={perDim[d]} delay={reduce ? 0 : 0.15 + i * 0.08} />
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div className="mt-9">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Vos 2 priorités
                    </h3>
                    <div className="flex flex-col gap-3">
                      {lowestDims.map((d) => (
                        <div key={d} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                            !
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{DIMENSIONS[d]}</div>
                            <p className="mt-0.5 text-sm text-muted-foreground">{RECOS[d]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Email capture */}
                  <div className="mt-9 rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-transparent p-5 sm:p-6">
                    {submitState === "done" ? (
                      <div className="flex items-center gap-3 py-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold">C'est envoyé !</div>
                          <p className="text-sm text-muted-foreground">
                            Votre plan d'action détaillé arrive dans votre boîte mail. À très vite.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold">Recevez votre plan d'action détaillé</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Un e-mail avec les recommandations concrètes adaptées à votre score, gratuitement.
                        </p>
                        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="vous@entreprise.com"
                              className="form-field flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                            />
                            <button
                              type="submit"
                              disabled={!email || !consent || submitState === "loading"}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {submitState === "loading" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  Recevoir mon plan <ArrowRight className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          </div>
                          <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={consent}
                              onChange={(e) => setConsent(e.target.checked)}
                              className="mt-0.5 h-4 w-4 accent-[hsl(217,91%,60%)]"
                            />
                            J'accepte de recevoir mon plan d'action et des conseils de KRAON par e-mail. Désinscription en un clic.
                          </label>
                          {submitState === "error" && (
                            <p className="text-xs text-rose-400">
                              Une erreur est survenue. Réessayez, ou écrivez-nous directement.
                            </p>
                          )}
                        </form>
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={restart}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="h-4 w-4" /> Refaire le test
                    </button>
                    <Link href="/#contact" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                      Parler à un expert <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Résultat indicatif fondé sur vos réponses. Aucune donnée n'est partagée sans votre accord.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
