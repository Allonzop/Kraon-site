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
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
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

// Pages publiques à référencer. Priorité indicative pour les moteurs.
const routes = [
  { path: "/", priority: "1.0" },
  { path: "/offre", priority: "0.9" },
  { path: "/audit-gratuit", priority: "0.7" },
  { path: "/mentions-legales", priority: "0.2" },
  { path: "/cgv", priority: "0.2" },
  { path: "/confidentialite", priority: "0.2" },
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
console.log(`[seo] sitemap.xml + robots.txt générés pour ${site}`);
