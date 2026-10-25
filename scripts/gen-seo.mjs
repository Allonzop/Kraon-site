/**
 * Génère sitemap.xml + robots.txt avec l'URL RÉELLE du site, au moment du build.
 *
 * L'URL est lue depuis la variable d'environnement `URL` fournie automatiquement
 * par Netlify (adresse principale du site : domaine perso s'il existe, sinon
 * l'URL *.netlify.app). Rien à saisir à la main, et cela reste correct si vous
 * ajoutez un domaine plus tard.
 *
 * Écrit dans dist/public (sortie du build Vite). Lancé APRÈS `vite build` :
 *   netlify.toml -> command = "npx vite build && node scripts/gen-seo.mjs"
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "dist/public");

// Netlify expose `URL` ; fallbacks pour un build local ou une autre plateforme.
const site = (process.env.URL || process.env.SITE_URL || process.env.DEPLOY_PRIME_URL || "")
  .trim()
  .replace(/\/$/, "");

if (!site) {
  console.warn("[seo] Aucune variable URL/SITE_URL — sitemap.xml et robots.txt non régénérés (build local).");
  process.exit(0);
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

/**
 * Pages publiques. `title` et `description` servent à DEUX choses :
 * le sitemap, et surtout un fichier HTML par route (voir plus bas).
 *
 * Sans ces fichiers, le repli SPA renvoie le même index.html pour toutes les
 * URLs : Google voit sept pages portant le même titre et la même description,
 * les traite comme des doublons, et n'en garde qu'une. Les robots qui
 * n'exécutent pas JavaScript (aperçus de liens, moteurs secondaires) ne
 * voient quant à eux rien du tout.
 *
 * Le corps de page reste vide et React l'hydrate : ce n'est pas du rendu
 * serveur, seulement des métadonnées correctes par URL. C'est ce qui manquait.
 */
const routes = [
  {
    path: "/",
    priority: "1.0",
    title: "KRAON — Création de sites internet pour artisans",
    description:
      "KRAON crée des sites internet sur-mesure pour les artisans : une vitrine professionnelle, rapide et soignée, qui met votre savoir-faire en valeur et vous apporte des clients.",
  },
  {
    path: "/offre",
    priority: "0.9",
    title: "Votre site professionnel en 7 jours — 450€ | KRAON",
    description:
      "Votre site vitrine professionnel livré en 7 jours, à partir de 450€. Design sur-mesure, optimisé mobile, maquette gratuite. Offre de lancement réservée aux 20 premiers clients.",
  },
  {
    path: "/a-propos",
    priority: "0.8",
    title: "À propos — KRAON",
    description:
      "Un interlocuteur unique, du premier message à la livraison. Celui qui vous répond est celui qui conçoit, développe et met votre site en ligne.",
  },
  {
    path: "/audit-gratuit",
    priority: "0.7",
    title: "Audit digital gratuit — KRAON",
    description:
      "Obtenez en 60 secondes votre score de performance digitale et un plan d'action personnalisé pour votre présence en ligne. Gratuit et sans engagement.",
  },
  {
    path: "/mentions-legales",
    priority: "0.2",
    title: "Mentions légales — KRAON",
    description: "Mentions légales du site KRAON : éditeur, hébergeur, propriété intellectuelle.",
  },
  {
    path: "/cgv",
    priority: "0.2",
    title: "Conditions Générales de Vente — KRAON",
    description: "Conditions générales de vente de KRAON, applicables aux prestations de création de sites internet entre professionnels.",
  },
  {
    path: "/confidentialite",
    priority: "0.2",
    title: "Politique de confidentialité — KRAON",
    description: "Comment KRAON collecte, utilise et protège vos données personnelles.",
  },
];

const today = new Date().toISOString().slice(0, 10);

const urls = routes
  .map(
    (r) =>
      `  <url>\n    <loc>${site}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const robots = `# KRAON — robots.txt\nUser-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`;

writeFileSync(resolve(outDir, "sitemap.xml"), sitemap);
writeFileSync(resolve(outDir, "robots.txt"), robots);

/* ------------------------------------------------------------------ *
 * Un fichier HTML par route, avec ses propres métadonnées.
 *
 * Netlify sert `/offre` depuis `offre.html` s'il existe, et ne retombe sur
 * la règle SPA que si aucun fichier ne correspond. La racine garde son
 * index.html. Rien à changer dans netlify.toml.
 * ------------------------------------------------------------------ */
const indexPath = resolve(outDir, "index.html");
if (!existsSync(indexPath)) {
  console.warn("[seo] dist/public/index.html introuvable — pages par route non générées.");
  process.exit(0);
}
const template = readFileSync(indexPath, "utf8");

/** Échappe ce qui part dans un attribut HTML ou dans du JSON-LD. */
const esc = (v) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Remplace la valeur d'une balise meta déjà présente dans le gabarit. */
function setMeta(html, key, name, value) {
  const re = new RegExp(`(<meta\\s+${key}="${name}"\\s+content=")[^"]*(")`, "i");
  return re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html;
}

let written = 0;
for (const r of routes) {
  const url = `${site}${r.path}`;
  let html = template;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(r.title)}</title>`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${esc(url)}$2`);
  html = setMeta(html, "name", "description", r.description);
  html = setMeta(html, "property", "og:title", r.title);
  html = setMeta(html, "property", "og:description", r.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", r.title);
  html = setMeta(html, "name", "twitter:description", r.description);

  // Les URLs absolues du gabarit pointent sur le domaine par défaut : on les
  // réaligne sur le domaine réellement servi (utile le jour d'un vrai domaine).
  html = html.replaceAll("https://kraon.netlify.app/", `${site}/`);

  const file = r.path === "/" ? "index.html" : `${r.path.replace(/^\//, "")}.html`;
  writeFileSync(resolve(outDir, file), html);
  written += 1;
}

console.log(`[seo] sitemap.xml + robots.txt + ${written} pages HTML générés pour ${site}`);
