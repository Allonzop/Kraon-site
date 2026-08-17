import { Fragment } from "react";

interface MarqueeProps {
  items: string[];
  /** Seconds for one full loop. */
  speed?: number;
  reverse?: boolean;
}

/**
 * An infinite, GPU-driven marquee band of keywords with faded edges. Pauses on
 * hover; the CSS animation (see index.css) is disabled under reduced-motion.
 */
export default function Marquee({ items, speed = 32, reverse = false }: MarqueeProps) {
  return (
    <div className="marquee group relative overflow-hidden border-y border-border/50 bg-muted/20 py-5">
      <div
        className="marquee-track flex w-max items-center gap-10 sm:gap-16"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-10 sm:gap-16" aria-hidden={copy === 1}>
                <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-muted-foreground/70 whitespace-nowrap transition-colors">
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent shrink-0" />
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
