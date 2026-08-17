import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { projects, loc } from "@/lib/projects";

export default function Work() {
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="work" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("work.title").includes("Featured") ? (
              <>Featured <span className="gradient-text">Work</span></>
            ) : (
              <><span className="gradient-text">{t("work.title")}</span></>
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("work.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                className="project-card relative glass rounded-xl overflow-hidden group cursor-pointer focus-within:ring-2 focus-within:ring-primary/50"
                tabIndex={0}
                role="button"
                aria-label={`${t("work.viewDetails")}: ${project.title}`}
                initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  rotateY: -2,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                data-testid={`project-${project.id}`}
              >
                <motion.div
                  className={`aspect-video bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Real screenshot background (when provided) */}
                  {project.cardImage && (
                    <img
                      src={project.cardImage}
                      alt={`${project.title} — ${loc(project.category, language)}`}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  )}

                  {/* Animated background pattern */}
                  {!project.cardImage && (
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                      }}
                      animate={shouldReduceMotion ? {} : { backgroundPosition: ["0px 0px", "20px 20px"] }}
                      transition={shouldReduceMotion ? {} : { duration: 10, repeat: Infinity, ease: "linear" }}
                      aria-hidden="true"
                    />
                  )}

                  <div className={project.cardImage ? "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" : "absolute inset-0 bg-secondary/30"} />

                  {/* Brand mark — logo when available, otherwise a designed icon tile */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-all duration-300 group-hover:opacity-0 group-hover:scale-95">
                    {project.cardImage && project.logo ? (
                      <div className="bg-black/70 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/15 shadow-2xl">
                        <img
                          src={project.logo}
                          alt={`${project.title} logo`}
                          className={`w-auto object-contain ${project.logoClassName ?? "h-8"}`}
                          style={{ maxWidth: "180px" }}
                          loading="lazy"
                        />
                      </div>
                    ) : project.logo ? (
                      <div className="bg-black/85 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-2xl">
                        <img
                          src={project.logo}
                          alt={`${project.title} logo`}
                          className="h-12 w-auto object-contain"
                          style={{ maxWidth: "160px" }}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/15 flex items-center justify-center shadow-2xl">
                          <Icon className="w-9 h-9 text-white/90" aria-hidden="true" />
                        </div>
                        <span className="text-lg font-semibold text-white/95 tracking-wide">
                          {project.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Floating accent */}
                  <motion.div
                    className="absolute top-4 right-4 w-4 h-4 bg-white/30 rounded-full"
                    animate={shouldReduceMotion ? {} : { y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={shouldReduceMotion ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                    aria-hidden="true"
                  />

                  {/* Category chip */}
                  <motion.div
                    className="absolute bottom-4 left-4 z-10"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <span className="text-sm text-foreground bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      {loc(project.category, language)}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Mobile content - always visible on small screens */}
                <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 z-10">
                  <h3 className="text-lg font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-sm text-white/90 mb-3">{loc(project.result, language)}</p>
                  <Link href={`/project/${project.id}`}>
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm w-full"
                      data-testid={`button-view-details-mobile-${project.id}`}
                    >
                      {t("work.viewDetails")}
                    </button>
                  </Link>
                </div>

                {/* Desktop hover overlay */}
                <div className="project-overlay hidden sm:flex absolute inset-0 bg-black/80 backdrop-blur-sm items-center justify-center opacity-0 translate-y-5 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto z-20">
                  <div className="text-center px-6">
                    <h3 className="text-2xl font-bold mb-3 text-white">{project.title}</h3>
                    <p className="text-lg mb-6 text-white/90">{loc(project.result, language)}</p>
                    <Link href={`/project/${project.id}`}>
                      <button
                        className="bg-primary/90 backdrop-blur-sm border border-primary text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        data-testid={`button-view-details-${project.id}`}
                      >
                        {t("work.viewDetails")}
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ zIndex: -1 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
