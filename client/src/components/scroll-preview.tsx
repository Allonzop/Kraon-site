import { useEffect, useRef, useState } from "react";

interface ScrollPreviewProps {
  src: string;
  alt: string;
  url?: string;
}

/**
 * A browser-frame mockup whose tall screenshot auto-scrolls up and down on a
 * loop, giving a live "preview" of a full website. The scroll distance is
 * measured so it stays correct across breakpoints; pauses on hover and honours
 * reduced-motion (handled in index.css).
 */
export default function ScrollPreview({ src, alt, url = "pepiliya.fr" }: ScrollPreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const v = viewportRef.current;
      const i = imgRef.current;
      if (!v || !i) return;
      const d = i.offsetHeight - v.offsetHeight;
      setDistance(d > 0 ? Math.round(d) : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (imgRef.current) ro.observe(imgRef.current);
    window.addEventListener("resize", measure);

    const img = imgRef.current;
    if (img && !img.complete) img.addEventListener("load", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      if (img) img.removeEventListener("load", measure);
    };
  }, [src]);

  // ~55px per second, with a sensible minimum.
  const duration = Math.max(16, Math.round(distance / 55));

  return (
    <div className="scroll-preview-frame rounded-2xl overflow-hidden border border-white/10 bg-[#1b1b1b] shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex-1 flex justify-center">
          <span className="inline-block text-xs text-white/50 bg-white/5 rounded-md px-4 py-1 max-w-[75%] truncate">
            {url}
          </span>
        </div>
      </div>

      {/* Scrolling viewport */}
      <div ref={viewportRef} className="relative h-[260px] sm:h-[360px] lg:h-[440px] overflow-hidden">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full block ${distance > 0 ? "scroll-preview-anim" : ""}`}
          style={
            distance > 0
              ? ({
                  ["--scroll-d" as string]: `-${distance}px`,
                  ["--scroll-dur" as string]: `${duration}s`,
                  willChange: "transform",
                } as React.CSSProperties)
              : undefined
          }
        />
        {/* Soft edge fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
    </div>
  );
}
