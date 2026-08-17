import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  /** e.g. "+400%", "5+", "<24h", "x5", "67€", "19 ans" */
  value: string;
  duration?: number;
  className?: string;
}

/**
 * Counts the numeric part of a label up from zero when scrolled into view,
 * preserving any prefix/suffix (%, +, €, "ans"…). Falls back to the final
 * value under reduced-motion or when no number is present.
 */
export default function CountUp({ value, duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  const match = value.match(/-?[\d]+(?:[.,][\d]+)?/);

  const buildInitial = () => {
    if (!match || reduceMotion) return value;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[0].length);
    return `${prefix}0${suffix}`;
  };

  const [display, setDisplay] = useState<string>(buildInitial);

  useEffect(() => {
    if (!inView) return;
    if (!match || reduceMotion) {
      setDisplay(value);
      return;
    }
    const numStr = match[0];
    const decimals = (numStr.split(/[.,]/)[1] ?? "").length;
    const target = parseFloat(numStr.replace(",", "."));
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + numStr.length);

    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const formatted = decimals ? v.toFixed(decimals) : Math.round(v).toString();
        setDisplay(`${prefix}${formatted}${suffix}`);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
