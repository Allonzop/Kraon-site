import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Show the moving light glare. */
  glare?: boolean;
}

/**
 * A 3D tilt container that follows the cursor with a soft, springy motion and
 * an optional light glare that tracks the pointer. Motion-value driven (no
 * re-renders); flattens out under reduced-motion.
 */
export default function TiltCard({ children, className, max = 9, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 150, damping: 15 });

  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 45%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }
      }
      className={className}
    >
      {children}
      {glare && !reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
