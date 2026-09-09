import { Fragment } from "react";
import { useLanguage } from "@/lib/i18n";
import { TOOL_LOGOS } from "@/lib/tool-logos";

/**
 * Bandeau défilant des outils réellement utilisés (IA, automatisation, gestion).
 * Réutilise l'animation CSS `.marquee` (voir index.css) : défilement GPU, bords
 * estompés, pause au survol, désactivée sous prefers-reduced-motion.
 * Les logos sont des SVG inline : aucune requête réseau, aucun dépendance.
 */
export default function ToolsBand({ speed = 45 }: { speed?: number }) {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border/50 bg-muted/20 py-8" aria-label={t("tools.label")}>
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
        {t("tools.label")}
      </p>

      <div className="marquee group relative overflow-hidden">
        <div
          className="marquee-track flex w-max items-center gap-10 sm:gap-14"
          style={{ animationDuration: `${speed}s` }}
        >
          {[0, 1].map((copy) => (
            <Fragment key={copy}>
              {TOOL_LOGOS.map((tool, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="group/logo flex shrink-0 items-center gap-3"
                  aria-hidden={copy === 1}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 shrink-0 fill-current text-muted-foreground/55 transition-colors duration-300 group-hover/logo:text-[var(--brand)]"
                    style={{ ["--brand" as string]: tool.hex } as React.CSSProperties}
                  >
                    <title>{tool.name}</title>
                    <path d={tool.path} />
                  </svg>
                  <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-muted-foreground/55 transition-colors duration-300 group-hover/logo:text-foreground sm:text-xl">
                    {tool.name}
                  </span>
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
