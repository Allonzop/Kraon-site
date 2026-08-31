import type { LucideIcon } from "lucide-react";
import { ShoppingBag, BarChart3, Building2, UtensilsCrossed } from "lucide-react";
import type { Language } from "@/lib/i18n";

import visionLogo from "@assets/Logo Tech Blanc_1758895568511.png";
import capImage from "@assets/IMG_0371_1758895568511.jpeg";
import previewVideo from "@assets/ScreenRecording_04-27-2025 01-51-19_1_1758895568511.mp4";
import pepiliyaLogo from "@assets/pepiliya-logo-beige.png";
import pepiliyaHero from "@assets/pepiliya-hero.jpg";
import pepiliyaPreview from "@assets/pepiliya-preview-full.jpg";
import atmosphereLogo from "@assets/atmosphere-logo.png";
import atmosphereHero from "@assets/atmosphere-hero.jpg";
import atmospherePreview from "@assets/atmosphere-preview-full.jpg";
import datavizHero from "@assets/dataviz-hero.jpg";
import datavizPreview from "@assets/dataviz-preview-full.jpg";

/** A string that has a French and an English variant. */
export interface Localized {
  fr: string;
  en: string;
}

export interface ProjectMetric {
  value: string;
  label: Localized;
}

/** An alternating image/text block on the project detail page. */
export interface ShowcaseBlock {
  media:
    | { kind: "video"; src: string; poster?: string }
    | { kind: "image"; src: string; alt: Localized }
    | { kind: "scrollPreview"; src: string; alt: Localized; url?: string }
    | { kind: "placeholder"; aspect?: "video" | "square" };
  title: Localized;
  desc: Localized;
  highlights: Localized[];
  reverse?: boolean;
}

export interface Testimonial {
  quote: Localized;
  author: string;
  role: Localized;
}

export interface Project {
  id: number;
  /** Brand name — identical in both languages. */
  title: string;
  subtitle: Localized;
  category: Localized;
  /** One-line result shown on the portfolio card. */
  result: Localized;
  year: string;
  url?: string;
  /** Internal route to a live, in-app demo (e.g. "/showcase/dataviz-pro"). */
  demoPath?: string;
  /** Tailwind gradient classes used for the card + hero backdrop. */
  gradient: string;
  icon: LucideIcon;
  /** Optional logo image (real projects). */
  logo?: string;
  /** Extra classes to size the logo (e.g. wide wordmarks). */
  logoClassName?: string;
  /** Real screenshot used as the portfolio card background. */
  cardImage?: string;
  /** Real screenshot used as the detail hero (replaces the gradient panel). */
  heroImage?: string;
  heroTagline: Localized;
  description: Localized;
  overviewHighlights: Localized[];
  metrics: ProjectMetric[];
  showcases: ShowcaseBlock[];
  challenges: Localized[];
  solutions: Localized[];
  /** Optional client testimonial shown on the detail page. */
  testimonial?: Testimonial;
  /** Marks placeholder content that should be replaced with real case studies. */
  isPlaceholder?: boolean;
}

/**
 * Central source of truth for portfolio projects.
 * Project 1 (Wear the Vision) is real; projects 2–4 are placeholder case
 * studies with realistic copy — swap in real content, metrics and media later.
 */
export const projects: Project[] = [
  {
    id: 5,
    title: "Pepiliya",
    subtitle: { fr: "Architecture & aménagement tertiaire", en: "Architecture & workspace design" },
    category: { fr: "Site vitrine", en: "Portfolio website" },
    result: {
      fr: "Site portfolio premium pour une architecte d'exception",
      en: "Premium portfolio site for a leading architect",
    },
    year: "2025",
    gradient: "from-[#c65a3a]/30 to-[#7a6a58]/25",
    icon: Building2,
    logo: pepiliyaLogo,
    logoClassName: "h-6 sm:h-7",
    cardImage: pepiliyaHero,
    heroImage: pepiliyaHero,
    heroTagline: { fr: "Élégance · Modularité · Engagement", en: "Elegance · Modularity · Commitment" },
    description: {
      fr: "Pepiliya est l'agence d'architecture et d'aménagement tertiaire fondée par Gayathri Pepiliya, architecte DPLG forte de 19 ans d'expérience auprès de grands comptes (Thales, Total, Vinci, Equans, Bachmann…). Nous avons conçu et développé son site portfolio : une expérience éditoriale sur-mesure, à la hauteur de l'exigence de ses réalisations, pensée pour convertir des projets d'aménagement d'envergure.",
      en: "Pepiliya is the architecture and workspace-design studio founded by Gayathri Pepiliya, a DPLG architect with 19 years of experience serving major accounts (Thales, Total, Vinci, Equans, Bachmann…). We designed and built her portfolio site: a bespoke editorial experience that matches the standard of her work and is built to convert high-value fit-out projects.",
    },
    overviewHighlights: [
      { fr: "Direction artistique fidèle à l'identité Pepiliya", en: "Art direction true to the Pepiliya identity" },
      { fr: "Mise en scène immersive des réalisations", en: "Immersive staging of the projects" },
      { fr: "Développement sur-mesure, rapide et responsive", en: "Bespoke, fast and responsive build" },
    ],
    metrics: [
      { value: "100%", label: { fr: "Design sur-mesure", en: "Bespoke design" } },
      { value: "4", label: { fr: "Galeries de réalisations", en: "Project galleries" } },
      { value: "8+", label: { fr: "Grands comptes valorisés", en: "Blue-chip clients featured" } },
      { value: "19 ans", label: { fr: "d'expertise mise en avant", en: "of expertise showcased" } },
    ],
    showcases: [
      {
        media: {
          kind: "scrollPreview",
          src: pepiliyaPreview,
          alt: { fr: "Aperçu défilant du site Pepiliya", en: "Scrolling preview of the Pepiliya website" },
          url: "pepiliya.fr",
        },
        title: { fr: "Une expérience éditoriale de bout en bout", en: "An end-to-end editorial experience" },
        desc: {
          fr: "Du hero cinématographique aux galeries de projets, chaque section raconte une histoire. Typographie soignée, palette chaleureuse et rythme de lecture pensé pour valoriser l'architecture et retenir l'attention des décideurs.",
          en: "From the cinematic hero to the project galleries, every section tells a story. Refined typography, a warm palette and a reading rhythm designed to showcase the architecture and hold decision-makers' attention.",
        },
        highlights: [
          { fr: "Hero immersif et parcours narratif", en: "Immersive hero and narrative flow" },
          { fr: "Galeries projets & témoignages clients", en: "Project galleries & client testimonials" },
          { fr: "100% responsive, du mobile au grand écran", en: "Fully responsive, mobile to widescreen" },
        ],
      },
    ],
    challenges: [
      { fr: "Traduire une exigence architecturale en expérience web", en: "Translating architectural standards into a web experience" },
      { fr: "Valoriser des clients prestigieux sans surcharger", en: "Showcasing prestigious clients without clutter" },
      { fr: "Créer une identité digitale mémorable et sobre", en: "Creating a memorable yet understated digital identity" },
    ],
    solutions: [
      { fr: "Direction artistique éditoriale et typographie forte", en: "Editorial art direction and strong typography" },
      { fr: "Mise en scène immersive des réalisations", en: "Immersive staging of the projects" },
      { fr: "Développement performant et responsive sur-mesure", en: "High-performance, bespoke responsive build" },
    ],
    testimonial: {
      quote: {
        fr: "KRAON a immédiatement compris l'exigence de mon métier et l'a traduite en un site à mon image : élégant, fluide et fidèle à l'esprit Pepiliya. Un accompagnement à la hauteur de mes projets, du premier échange à la livraison.",
        en: "KRAON immediately understood the standards of my profession and turned them into a site that looks like me: elegant, fluid and true to the Pepiliya spirit. Support worthy of my own projects, from the first conversation to delivery.",
      },
      author: "Gayathri Pepiliya",
      role: { fr: "Fondatrice, Pepiliya", en: "Founder, Pepiliya" },
    },
  },
  {
    id: 6,
    title: "L'Atmosphère",
    subtitle: { fr: "Restaurant bistronomique · Reims", en: "Bistronomic restaurant · Reims" },
    category: { fr: "Site vitrine & réservation", en: "Showcase & booking site" },
    result: {
      fr: "Site immersif pour un restaurant bistronomique de Reims",
      en: "Immersive website for a Reims bistronomic restaurant",
    },
    year: "2025",
    url: "atmosphere-reims.com",
    gradient: "from-[#7a1f2b]/35 to-[#b8963f]/20",
    icon: UtensilsCrossed,
    logo: atmosphereLogo,
    logoClassName: "h-11 sm:h-12",
    cardImage: atmosphereHero,
    heroImage: atmosphereHero,
    heroTagline: { fr: "Entre feu et vin, une heure suspendue", en: "Between fire and wine, an hour suspended" },
    description: {
      fr: "L'Atmosphère est un restaurant bistronomique niché au cœur de Reims (5 rue de Venise), réputé pour sa cuisine de saison, sa cave à vins de 180 références et ses champagnes de prestige. Nous avons imaginé et développé son site : une expérience sombre et cinématographique qui restitue l'ambiance feutrée du lieu, met en scène la carte et la cave, et intègre la réservation en ligne — pensée pour transformer les visiteurs en clients attablés.",
      en: "L'Atmosphère is a bistronomic restaurant in the heart of Reims (5 rue de Venise), known for its seasonal cuisine, a 180-reference wine cellar and prestige champagnes. We designed and built its website: a dark, cinematic experience that captures the venue's intimate mood, stages the menu and the cellar, and integrates online booking — crafted to turn visitors into seated guests.",
    },
    overviewHighlights: [
      { fr: "Direction artistique sombre et cinématographique", en: "Dark, cinematic art direction" },
      { fr: "Carte et cave à vins mises en scène", en: "Menu and wine cellar staged with care" },
      { fr: "Réservation en ligne intégrée", en: "Integrated online reservation" },
    ],
    metrics: [
      { value: "180", label: { fr: "Références en cave à vins", en: "Wine cellar references" } },
      { value: "4.7★", label: { fr: "Note moyenne clients", en: "Average customer rating" } },
      { value: "24/7", label: { fr: "Réservation en ligne", en: "Online booking" } },
      { value: "100%", label: { fr: "Design sur-mesure", en: "Bespoke design" } },
    ],
    showcases: [
      {
        media: {
          kind: "scrollPreview",
          src: atmospherePreview,
          alt: { fr: "Aperçu défilant du site L'Atmosphère", en: "Scrolling preview of the L'Atmosphère website" },
          url: "atmosphere-reims.com",
        },
        title: { fr: "Une expérience à l'image du lieu", en: "An experience that mirrors the venue" },
        desc: {
          fr: "Du hero cinématographique à la présentation de la carte et de la cave, chaque section plonge le visiteur dans l'ambiance chaleureuse et intime du restaurant. Palette sombre, typographie serif élégante et rythme soigné pour donner envie de réserver.",
          en: "From the cinematic hero to the menu and cellar sections, every part immerses the visitor in the restaurant's warm, intimate mood. A dark palette, elegant serif typography and careful pacing designed to make you want to book.",
        },
        highlights: [
          { fr: "Hero immersif et ambiance feutrée", en: "Immersive hero, intimate mood" },
          { fr: "Carte, cave à vins & avis clients", en: "Menu, wine cellar & client reviews" },
          { fr: "100% responsive et rapide", en: "Fully responsive and fast" },
        ],
      },
    ],
    challenges: [
      { fr: "Restituer l'ambiance du restaurant en ligne", en: "Capturing the restaurant's mood online" },
      { fr: "Valoriser une cave de 180 références sans surcharger", en: "Showcasing a 180-reference cellar without clutter" },
      { fr: "Faciliter la réservation depuis le site", en: "Making booking from the site effortless" },
    ],
    solutions: [
      { fr: "Direction artistique sombre et photographies soignées", en: "Dark art direction and refined photography" },
      { fr: "Cave à vins filtrable et lisible", en: "Filterable, readable wine cellar" },
      { fr: "Parcours de réservation direct et clair", en: "Direct, clear booking journey" },
    ],
    testimonial: {
      quote: {
        fr: "KRAON a su capturer l'âme de L'Atmosphère : un site élégant, chaleureux et fidèle à l'expérience que nous offrons à table. Nos clients réservent désormais en ligne en quelques clics.",
        en: "KRAON captured the soul of L'Atmosphère: an elegant, warm site that is true to the experience we offer at the table. Our guests now book online in just a few clicks.",
      },
      author: "L'Atmosphère",
      role: { fr: "Restaurant bistronomique, Reims", en: "Bistronomic restaurant, Reims" },
    },
  },
  {
    id: 1,
    title: "Wear the Vision",
    subtitle: { fr: "Concept de boutique — casquettes premium", en: "Store concept — premium caps" },
    category: { fr: "Maquette e-commerce", en: "E-commerce mockup" },
    result: {
      fr: "Maquette de boutique e-commerce premium (concept)",
      en: "Premium e-commerce store mockup (concept)",
    },
    year: "2024",
    gradient: "from-primary/25 to-accent/20",
    icon: ShoppingBag,
    logo: visionLogo,
    isPlaceholder: true,
    heroTagline: { fr: "Futur | Durable | Libre", en: "Future | Sustainable | Free" },
    description: {
      fr: "Maquette de boutique e-commerce premium sur le thème des casquettes durables, réalisée pour explorer une direction artistique et un parcours d'achat. Projet de démonstration — il illustre notre approche du design et de l'UX e-commerce, sans être une boutique en ligne active.",
      en: "Premium e-commerce store mockup themed around sustainable caps, created to explore an art direction and a purchase journey. A demonstration project — it shows our approach to e-commerce design and UX, and is not a live store.",
    },
    overviewHighlights: [
      { fr: "Direction artistique e-commerce sur-mesure", en: "Bespoke e-commerce art direction" },
      { fr: "Parcours d'achat pensé pour la conversion", en: "Purchase journey designed for conversion" },
      { fr: "Design mobile-first et animations soignées", en: "Mobile-first design and refined animations" },
    ],
    metrics: [
      { value: "100%", label: { fr: "Design sur-mesure", en: "Bespoke design" } },
      { value: "Mobile", label: { fr: "Pensé mobile d'abord", en: "Mobile-first" } },
      { value: "UX", label: { fr: "Parcours d'achat soigné", en: "Refined purchase journey" } },
      { value: "Concept", label: { fr: "Maquette de démonstration", en: "Demonstration mockup" } },
    ],
    showcases: [
      {
        media: { kind: "video", src: previewVideo, poster: capImage },
        title: { fr: "Navigation & Expérience", en: "Navigation & Experience" },
        desc: {
          fr: "Interface intuitive avec navigation fluide, mettant en valeur les produits durables à travers une expérience utilisateur soignée et des animations subtiles.",
          en: "Intuitive interface with smooth navigation, showcasing sustainable products through refined user experience and subtle animations.",
        },
        highlights: [
          { fr: "Animation fluide au scroll", en: "Smooth scroll animations" },
          { fr: "Design mobile-first", en: "Mobile-first design" },
          { fr: "Temps de chargement optimisé", en: "Optimized loading times" },
        ],
      },
      {
        media: {
          kind: "image",
          src: capImage,
          alt: { fr: "Casquette Wear the Vision", en: "Wear the Vision Cap" },
        },
        title: { fr: "Produit Premium", en: "Premium Product" },
        desc: {
          fr: "Casquettes durables fabriquées à partir de matières recyclées, alliant style moderne et engagement écologique. Design intemporel pour un public conscient.",
          en: "Sustainable caps made from recycled materials, combining modern style with ecological commitment. Timeless design for conscious consumers.",
        },
        highlights: [
          { fr: "Tissu premium recyclé", en: "Premium recycled fabric" },
          { fr: "Broderie haute qualité", en: "High-quality embroidery" },
          { fr: "Emballage éco-responsable", en: "Eco-responsible packaging" },
        ],
        reverse: true,
      },
    ],
    challenges: [
      { fr: "Positionnement premium sur un marché concurrentiel", en: "Premium positioning in a competitive market" },
      { fr: "Communication de la valeur durable", en: "Communicating sustainable value" },
      { fr: "Optimisation des conversions e-commerce", en: "E-commerce conversion optimization" },
      { fr: "Création d'une identité de marque forte", en: "Creating strong brand identity" },
    ],
    solutions: [
      { fr: "Design épuré et moderne avec focus sur la durabilité", en: "Clean and modern design focused on sustainability" },
      { fr: "Storytelling autour des valeurs écologiques", en: "Storytelling around ecological values" },
      { fr: "Parcours d'achat optimisé et intuitif", en: "Optimized and intuitive purchase journey" },
      { fr: "Stratégie de contenu engageante sur les réseaux", en: "Engaging content strategy on social networks" },
    ],
  },
  {
    id: 2,
    title: "DataViz Pro",
    subtitle: { fr: "Tableau de bord analytics B2B", en: "B2B analytics dashboard" },
    category: { fr: "SaaS · Démo produit", en: "SaaS · Product demo" },
    result: {
      fr: "Tableau de bord analytics interactif, en démo live",
      en: "Interactive analytics dashboard, live demo",
    },
    year: "2025",
    demoPath: "/showcase/dataviz-pro",
    gradient: "from-accent/25 to-primary/20",
    icon: BarChart3,
    cardImage: datavizHero,
    heroTagline: { fr: "Données · Clarté · Décision", en: "Data · Clarity · Decision" },
    description: {
      fr: "DataViz Pro est un tableau de bord analytics conçu et développé par KRAON comme démonstration de notre savoir-faire produit. Une interface SaaS complète — KPI animés, graphiques temps réel, filtres par période et par segment, tableau de campagnes — entièrement fonctionnelle et responsive. Explorez la démo live : chaque filtre recalcule et anime l'ensemble des données.",
      en: "DataViz Pro is an analytics dashboard designed and built by KRAON to demonstrate our product craft. A complete SaaS interface — animated KPIs, real-time charts, period and segment filters, a campaigns table — fully functional and responsive. Explore the live demo: every filter recomputes and animates the whole dataset.",
    },
    overviewHighlights: [
      { fr: "Interface SaaS complète et interactive", en: "Complete, interactive SaaS interface" },
      { fr: "Graphiques animés et responsives (Recharts)", en: "Animated, responsive charts (Recharts)" },
      { fr: "Filtres temps réel période & segment", en: "Real-time period & segment filters" },
    ],
    metrics: [
      { value: "12+", label: { fr: "Visualisations de données", en: "Data visualizations" } },
      { value: "60 fps", label: { fr: "Animations fluides", en: "Smooth animations" } },
      { value: "100%", label: { fr: "Responsive & accessible", en: "Responsive & accessible" } },
      { value: "0 ms", label: { fr: "Latence (données locales)", en: "Latency (local data)" } },
    ],
    showcases: [
      {
        media: {
          kind: "scrollPreview",
          src: datavizPreview,
          alt: { fr: "Aperçu du tableau de bord DataViz Pro", en: "Preview of the DataViz Pro dashboard" },
          url: "datavizpro.app",
        },
        title: { fr: "Un tableau de bord de A à Z", en: "A dashboard built end to end" },
        desc: {
          fr: "KPI avec compteurs animés, courbe d'évolution à métrique commutable, répartition par appareil, acquisition par canal et top campagnes. Chaque changement de filtre régénère un jeu de données cohérent et anime les transitions.",
          en: "KPIs with animated counters, a switchable trend chart, device split, channel acquisition and top campaigns. Every filter change regenerates a consistent dataset and animates the transitions.",
        },
        highlights: [
          { fr: "KPI animés & sparklines", en: "Animated KPIs & sparklines" },
          { fr: "Graphiques aire / barres / donut", en: "Area / bar / donut charts" },
          { fr: "Filtres période & segment en direct", en: "Live period & segment filters" },
        ],
      },
      {
        media: {
          kind: "image",
          src: datavizHero,
          alt: { fr: "Interface DataViz Pro", en: "DataViz Pro interface" },
        },
        title: { fr: "Pensé pour prouver la technique", en: "Built to prove the craft" },
        desc: {
          fr: "Développé en React + TypeScript avec Recharts et framer-motion. Données générées côté client par un moteur déterministe, animations 60 fps respectant « prefers-reduced-motion », interface entièrement responsive du mobile au grand écran.",
          en: "Built in React + TypeScript with Recharts and framer-motion. Data generated client-side by a deterministic engine, 60 fps animations that respect ‘prefers-reduced-motion', a fully responsive interface from mobile to widescreen.",
        },
        highlights: [
          { fr: "React + TypeScript + Recharts", en: "React + TypeScript + Recharts" },
          { fr: "Moteur de données déterministe", en: "Deterministic data engine" },
          { fr: "Accessibilité & reduced-motion", en: "Accessibility & reduced-motion" },
        ],
        reverse: true,
      },
    ],
    challenges: [
      { fr: "Démontrer notre niveau technique sans client réel", en: "Demonstrating our technical level without a real client" },
      { fr: "Rendre des données crédibles et cohérentes", en: "Making data credible and consistent" },
      { fr: "Garder l'interface fluide et responsive", en: "Keeping the interface smooth and responsive" },
    ],
    solutions: [
      { fr: "Une démo live entièrement fonctionnelle", en: "A fully functional live demo" },
      { fr: "Moteur de données déterministe et réaliste", en: "A deterministic, realistic data engine" },
      { fr: "Animations GPU et rendu optimisé", en: "GPU animations and optimized rendering" },
    ],
  },
];

export function getProject(id: number | string | undefined): Project | undefined {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  return projects.find((p) => p.id === numericId);
}

/** Resolve a Localized value for the active language. */
export function loc(value: Localized, language: Language): string {
  return value[language];
}
