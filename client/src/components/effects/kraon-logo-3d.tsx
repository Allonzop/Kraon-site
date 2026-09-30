import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Logo KRAON en 3D : animation d'assemblage (5 s) jouée une fois, puis tenue sur l'image finale.
 *
 * La vidéo est encodée en « alpha empilé » : la moitié haute contient la couleur (prémultipliée),
 * la moitié basse la transparence. Un petit shader WebGL recombine les deux, ce qui donne un logo
 * vraiment transparent par-dessus le fond animé du hero, y compris sur Safari et iPhone
 * (qui ne lisent pas la transparence des WebM). MP4 H.264 en priorité, WebM VP9 en secours.
 *
 * Repli : sans WebGL, ou si le visiteur a demandé moins d'animations, on affiche l'image finale (PNG transparent).
 */

const VIDEO_MP4 = "/media/kraon-logo-3d-alpha-empile.mp4";   // H.264 : Safari, iPhone, Chrome, Edge
const VIDEO_WEBM = "/media/kraon-logo-3d-alpha-empile.webm"; // VP9 : navigateurs sans H.264 (Chromium libre, certains Linux)
const POSTER_SRC = "/media/kraon-logo-3d.webp";

const VERT = `
attribute vec2 p;
varying vec2 uv;
void main() {
  uv = vec2(0.5 + 0.5 * p.x, 0.5 - 0.5 * p.y);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D t;
varying vec2 uv;
void main() {
  float a = texture2D(t, vec2(uv.x, 0.5 + uv.y * 0.5)).r;
  vec3 c = min(texture2D(t, vec2(uv.x, uv.y * 0.5)).rgb, vec3(a));
  gl_FragColor = vec4(c, a);
}`;

type Props = { className?: string; alt?: string };

export default function KraonLogo3D({ className = "", alt = "KRAON" }: Props) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (reduce) { setFallback(true); return; }
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { setFallback(true); return; }

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFallback(true); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.clearColor(0, 0, 0, 0);

    let raf = 0;
    let ready = false;
    const draw = () => {
      if (video.readyState >= 2) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (!ready) { ready = true; canvas.style.opacity = "1"; }
      }
      if (!video.ended) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => setFallback(true));
      raf = requestAnimationFrame(draw);
    };
    const onEnded = () => { cancelAnimationFrame(raf); draw(); };   // garde la dernière image
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", () => setFallback(true));
    video.src = video.canPlayType('video/mp4; codecs="avc1.4d401f"') ? VIDEO_MP4 : VIDEO_WEBM;
    video.addEventListener("loadeddata", start, { once: true });
    video.load();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("ended", onEnded);
    };
  }, [reduce]);

  if (fallback) {
    return <img src={POSTER_SRC} alt={alt} width={800} height={800} className={`w-full h-auto ${className}`} />;
  }

  return (
    <div className={`relative w-full aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        role="img"
        aria-label={alt}
        className="absolute inset-0 w-full h-full transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {/* La vidéo reste dans le DOM (condition de lecture auto sur iOS) mais invisible. */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        aria-hidden="true"
        className="absolute w-px h-px opacity-0 pointer-events-none"
      />
    </div>
  );
}
