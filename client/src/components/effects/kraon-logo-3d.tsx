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
 * Fluidité — quatre choses évitent de gaspiller du GPU et de la batterie :
 *  1. La vidéo est à 30 i/s mais l'écran rafraîchit à 60, 90 ou 120 Hz. On ne renvoie la texture
 *     que lorsque `currentTime` a réellement avancé : deux à quatre fois moins d'uploads, sans
 *     dépendre de `requestVideoFrameCallback` (absent de Firefox, et bridé quand le navigateur
 *     estime que la vidéo n'est pas visible — ce qui est notre cas, elle fait 1 px).
 *  2. La texture n'est allouée qu'une fois ; les images suivantes passent par `texSubImage2D`.
 *  3. Le canvas est dimensionné aux pixels réellement affichés (et non 800×800 en dur), ce qui
 *     divise d'autant le travail de rastérisation.
 *  4. À la fin de l'animation on bascule sur l'image fixe — extraite de la dernière image de la
 *     vidéo, donc rigoureusement identique — puis on libère le décodeur vidéo et le contexte
 *     WebGL. Le reste de la visite ne coûte plus rien.
 *
 * Repli : sans WebGL, ou si le visiteur a demandé moins d'animations, on affiche directement l'image fixe.
 */

const VIDEO_MP4 = "/media/kraon-logo-3d-alpha-empile.mp4"; // H.264 : Safari, iPhone, Chrome, Edge
const VIDEO_WEBM = "/media/kraon-logo-3d-alpha-empile.webm"; // VP9 : navigateurs sans H.264 (Chromium libre, certains Linux)
const POSTER_SRC = "/media/kraon-logo-3d.webp";

/** Résolution native de la moitié couleur : inutile de rastériser plus fin. */
const NATIVE_SIZE = 480;

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

/** L'animation est terminée (ou n'a jamais pu démarrer) : on tient l'image fixe. */
type Phase = "video" | "poster";

export default function KraonLogo3D({ className = "", alt = "KRAON" }: Props) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("video");

  useEffect(() => {
    if (reduce) {
      setPhase("poster");
      return;
    }
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      // Le rendu est une simple copie de texture : la puce intégrée suffit et consomme moins.
      powerPreference: "low-power",
    });
    if (!gl) {
      setPhase("poster");
      return;
    }

    // L'image fixe est décodée pendant que la vidéo joue, pour que la bascule de fin
    // n'ait rien à attendre. Tant qu'elle n'est pas prête, le canvas garde la main.
    let posterReady = false;
    const poster = new Image();
    poster.src = POSTER_SRC;
    if (typeof poster.decode === "function") {
      poster.decode().then(() => { posterReady = true; }).catch(() => { /* on gardera le canvas */ });
    } else {
      poster.onload = () => { posterReady = true; };
    }

    // Taille de rendu = taille affichée × densité de l'écran, plafonnée à la résolution source.
    const cssWidth = canvas.getBoundingClientRect().width || NATIVE_SIZE;
    const size = Math.min(NATIVE_SIZE, Math.ceil(cssWidth * Math.min(window.devicePixelRatio || 1, 3)));
    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, size, size);

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setPhase("poster");
      return;
    }
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

    let stopped = false;
    let raf = 0;
    let allocated = false; // la texture a-t-elle déjà sa mémoire ?
    let painted = false; // a-t-on affiché au moins une image ?
    let lastTime = -1; // horodatage de la dernière image envoyée au GPU

    /** `force` sert pour l'image finale, qu'il faut redessiner même si le temps n'a pas bougé. */
    const drawFrame = (force = false) => {
      if (video.readyState < 2) return;
      if (!force && video.currentTime === lastTime) return; // rien de neuf à envoyer
      lastTime = video.currentTime;
      if (allocated) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGB, gl.UNSIGNED_BYTE, video);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        allocated = true;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!painted) {
        painted = true;
        canvas.style.opacity = "1";
      }
    };

    const pump = () => {
      if (stopped) return;
      drawFrame();
      if (!video.ended) raf = requestAnimationFrame(pump);
    };

    /** Coupe le décodeur vidéo et rend sa mémoire : c'est le poste le plus coûteux. */
    const releaseVideo = () => {
      stopped = true;
      cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    // Fin de l'animation : l'image fixe prend le relais (elle est extraite de cette même
    // dernière image, la bascule est invisible), puis le contexte WebGL est rendu lui aussi.
    // Si l'image fixe n'est pas prête, le canvas garde simplement sa dernière image.
    const onEnded = () => {
      drawFrame(true);
      releaseVideo();
      if (!posterReady) return;
      setPhase("poster");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };

    const onFailure = () => {
      releaseVideo();
      setPhase("poster");
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onFailure);
    canvas.addEventListener("webglcontextlost", onFailure);

    const start = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(onFailure);
      pump();
    };
    video.src = video.canPlayType('video/mp4; codecs="avc1.4d401f"') ? VIDEO_MP4 : VIDEO_WEBM;
    video.addEventListener("loadeddata", start, { once: true });
    video.load();

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onFailure);
      canvas.removeEventListener("webglcontextlost", onFailure);
      releaseVideo();
    };
  }, [reduce]);

  if (phase === "poster") {
    return (
      <img
        src={POSTER_SRC}
        alt={alt}
        width={NATIVE_SIZE}
        height={NATIVE_SIZE}
        decoding="async"
        className={`w-full h-auto ${className}`}
      />
    );
  }

  return (
    <div className={`relative w-full aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
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
        aria-hidden="true"
        className="absolute w-px h-px opacity-0 pointer-events-none"
      />
    </div>
  );
}
