import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "wouter";
import { ArrowLeft, Globe, TrendingUp, Award, Quote, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { getProject, loc, type ShowcaseBlock } from "@/lib/projects";
import ScrollPreview from "@/components/scroll-preview";
import NotFound from "@/pages/not-found";

export default function ProjectDetail() {
  const { language } = useLanguage();
  const params = useParams();
  const project = getProject(params.id);

  // Land at the top of the page when opening a project.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  // Unknown id → 404.
  if (!project) {
    return <NotFound />;
  }

  const Icon = project.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-8 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#work">
            <Button variant="ghost" className="mb-6 group" data-testid="button-back-to-projects">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {language === "fr" ? "Retour aux projets" : "Back to projects"}
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-white/20 shrink-0 px-1.5">
                {project.logo ? (
                  <img
                    src={project.logo}
                    alt={`${project.title} logo`}
                    className={`w-auto object-contain ${project.logoClassName ?? "h-8"}`}
                  />
                ) : (
                  <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{project.title}</h1>
                <p className="text-lg text-muted-foreground">{loc(project.subtitle, language)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {project.url && (
                <>
                  <a
                    href={`https://${project.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-primary"
                  >
                    <Globe className="w-4 h-4" />
                    {project.url}
                  </a>
                  <span>•</span>
                </>
              )}
              <span>{loc(project.category, language)}</span>
              <span>•</span>
              <span>{project.year}</span>
              {project.isPlaceholder && (
                <span className="ml-auto text-xs px-2 py-1 rounded-full border border-accent/40 text-accent/90 bg-accent/10">
                  {language === "fr" ? "Étude de cas exemple" : "Sample case study"}
                </span>
              )}
            </div>

            {project.demoPath && (
              <Link href={project.demoPath}>
                <Button className="mt-6 group glow-blue" data-testid="button-live-demo">
                  {language === "fr" ? "Voir la démo live" : "View live demo"}
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Hero visual */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`relative aspect-video bg-gradient-to-br ${project.gradient} rounded-2xl overflow-hidden`}
          >
            {project.heroImage ? (
              <img
                src={project.heroImage}
                alt={`${project.title} — ${loc(project.subtitle, language)}`}
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="eager"
              />
            ) : (
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                  backgroundSize: "44px 44px",
                }}
                aria-hidden="true"
              />
            )}

            <div className={`absolute inset-0 flex items-center justify-center ${project.heroImage ? "bg-gradient-to-t from-black/85 via-black/55 to-black/45" : ""}`}>
              <div className="text-center text-white px-4">
                <div className="w-24 h-24 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/20 px-3">
                  {project.logo ? (
                    <img
                      src={project.logo}
                      alt={`${project.title} logo`}
                      className={`w-auto object-contain ${project.heroImage ? "h-8" : "h-12"}`}
                    />
                  ) : (
                    <Icon className="w-11 h-11 text-white" aria-hidden="true" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{project.title}</h3>
                <p className="text-white/90 drop-shadow-md">{loc(project.heroTagline, language)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview + metrics */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                {language === "fr" ? "Vue d'ensemble" : "Project Overview"}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {loc(project.description, language)}
              </p>

              <div className="space-y-4">
                {project.overviewHighlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? "bg-primary" : "bg-accent"}`} />
                    <span>{loc(item, language)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {project.metrics.map((metric, i) => (
                <div key={i} className="glass p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{loc(metric.label, language)}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Showcase blocks (alternating) */}
      {project.showcases.map((block, i) => (
        <section key={i} className={`py-16 ${i % 2 === 1 ? "bg-muted/30" : ""}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ShowcaseMedia block={block} language={language} order={block.reverse ? "lg:order-2" : ""} />
              <motion.div
                initial={{ opacity: 0, x: block.reverse ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className={block.reverse ? "lg:order-1" : ""}
              >
                <h3 className="text-2xl sm:text-3xl font-bold mb-6">{loc(block.title, language)}</h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{loc(block.desc, language)}</p>
                <div className="space-y-4">
                  {block.highlights.map((h, hi) => (
                    <div key={hi} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${hi % 2 === 0 ? "bg-primary" : "bg-accent"}`} />
                      <span>{loc(h, language)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Challenges & Solutions */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-accent" />
                {language === "fr" ? "Défis" : "Challenges"}
              </h3>
              <div className="space-y-4">
                {project.challenges.map((challenge, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{loc(challenge, language)}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                {language === "fr" ? "Solutions" : "Solutions"}
              </h3>
              <div className="space-y-4">
                {project.solutions.map((solution, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{loc(solution, language)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client testimonial */}
      {project.testimonial && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.figure
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
            >
              <Quote className="w-10 h-10 text-primary/40 mx-auto mb-6" aria-hidden="true" />
              <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed mb-8">
                “{loc(project.testimonial.quote, language)}”
              </blockquote>
              <figcaption className="flex flex-col items-center gap-1">
                <span className="font-semibold text-lg">{project.testimonial.author}</span>
                <span className="text-sm text-muted-foreground">{loc(project.testimonial.role, language)}</span>
              </figcaption>
              <div className="absolute -inset-x-10 -bottom-10 h-32 bg-gradient-to-t from-primary/10 to-transparent blur-2xl" aria-hidden="true" />
            </motion.figure>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {language === "fr" ? "Prêt à lancer votre projet ?" : "Ready to start your project?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === "fr"
                ? "Discutons de votre projet et créons ensemble une expérience exceptionnelle."
                : "Let's discuss your project and create an exceptional experience together."}
            </p>
            <Link href="/#contact">
              <Button size="lg" className="text-lg px-8" data-testid="button-start-project">
                {language === "fr" ? "Démarrer un projet" : "Start a project"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ShowcaseMedia({
  block,
  language,
  order,
}: {
  block: ShowcaseBlock;
  language: "fr" | "en";
  order: string;
}) {
  const { media } = block;

  return (
    <motion.div
      initial={{ opacity: 0, x: block.reverse ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`relative ${order}`}
    >
      {media.kind === "video" && (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10">
          <video
            src={media.src}
            poster={media.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto object-contain"
          >
            {language === "fr"
              ? "Votre navigateur ne supporte pas les vidéos HTML5."
              : "Your browser does not support HTML5 video."}
          </video>
        </div>
      )}

      {media.kind === "image" && (
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10 border border-white/10">
          <img src={media.src} alt={loc(media.alt, language)} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      {media.kind === "scrollPreview" && (
        <ScrollPreview src={media.src} alt={loc(media.alt, language)} url={media.url} />
      )}

      {media.kind === "placeholder" && (
        <div
          className={`relative ${
            media.aspect === "square" ? "aspect-square" : "aspect-video"
          } rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 flex items-center justify-center`}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
            }}
            aria-hidden="true"
          />
          <span className="relative text-sm text-muted-foreground px-4 py-2 rounded-full border border-white/15 bg-background/40 backdrop-blur-sm">
            {language === "fr" ? "Visuel à venir" : "Visual coming soon"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
