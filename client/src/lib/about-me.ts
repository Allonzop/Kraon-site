/**
 * Contenu de la page « À propos » (/a-propos) — SOURCE UNIQUE, éditable.
 *
 * Chaque texte est bilingue : { fr, en }. Modifiez les deux versions pour
 * rester cohérent quand un visiteur bascule la langue.
 *
 * Pour la photo : déposez votre portrait dans `client/public/media/portrait.jpg`
 * (idéalement la MÊME que sur WhatsApp / Instagram / vos e-mails). Tant que le
 * fichier n'existe pas, un visuel de remplacement s'affiche automatiquement.
 *
 * Le ton est volontairement centré sur le client (« vous »), pas sur soi.
 */
export interface Localized {
  fr: string;
  en: string;
}

export const ABOUT = {
  name: "Allonzo",
  location: "Charleville-Mézières",
  photo: "/media/portrait.jpg",
  role: {
    fr: "Créateur de sites internet pour artisans",
    en: "Website creator for craftspeople",
  },
  // Le titre est coupé en deux : la seconde partie s'affiche en dégradé.
  headline: {
    fr: "Un interlocuteur unique,",
    en: "One person,",
  },
  headlineAccent: {
    fr: "du premier message à la livraison",
    en: "from your first message to delivery",
  },
  tagline: {
    fr: "Pas d'agence anonyme, pas de standard : la personne qui vous répond est celle qui conçoit votre site.",
    en: "No anonymous agency, no call centre: the person who answers you is the one who designs your site.",
  },
  intro: [
    {
      fr: "Chez KRAON, vous avez un seul interlocuteur. Celui qui vous répond est celui qui dessine, développe et met votre site en ligne — et qui reste joignable ensuite.",
      en: "At KRAON you have a single point of contact. The person who replies is the one who designs, builds and puts your site online — and stays reachable afterwards.",
    },
    {
      fr: "L'objectif n'est pas de faire « joli », mais de vous apporter des clients : une vitrine claire, rapide et rassurante, pensée pour votre métier.",
      en: "The goal isn't to look nice — it's to bring you clients: a clear, fast, reassuring site built around your trade.",
    },
  ],
  steps: [
    {
      title: { fr: "On échange", en: "We talk" },
      desc: {
        fr: "Un premier contact simple pour comprendre votre métier, vos clients et ce que vous attendez de votre site.",
        en: "A simple first conversation to understand your trade, your customers and what you expect from your site.",
      },
    },
    {
      title: { fr: "Vous voyez une maquette", en: "You see a mockup" },
      desc: {
        fr: "Vous découvrez à quoi ressemblera votre site avant tout engagement. Vous voyez, vous ajustez.",
        en: "You see what your site will look like before committing to anything. You look, you adjust.",
      },
    },
    {
      title: { fr: "Vous validez", en: "You approve" },
      desc: {
        fr: "Rien n'est mis en ligne sans votre accord. Les révisions sont incluses jusqu'à ce que ce soit juste.",
        en: "Nothing goes live without your approval. Revisions are included until it feels right.",
      },
    },
    {
      title: { fr: "C'est livré", en: "It goes live" },
      desc: {
        fr: "Votre site en ligne en 7 jours, configuré et prêt à recevoir vos clients.",
        en: "Your site online in 7 days, configured and ready to welcome your customers.",
      },
    },
    {
      title: { fr: "On reste en contact", en: "We stay in touch" },
      desc: {
        fr: "Après la livraison, vous gardez un interlocuteur disponible pour vos évolutions et vos questions.",
        en: "After delivery you keep someone available for your changes and your questions.",
      },
    },
  ],
  reasons: [
    {
      title: { fr: "Un interlocuteur unique", en: "A single point of contact" },
      desc: {
        fr: "Vous savez toujours à qui vous parlez, du devis au suivi — pas de service client anonyme.",
        en: "You always know who you're talking to, from quote to follow-up — no anonymous support desk.",
      },
    },
    {
      title: { fr: "Transparence totale", en: "Complete transparency" },
      desc: {
        fr: "Prix clairs, périmètre écrit noir sur blanc, aucune mauvaise surprise.",
        en: "Clear prices, scope written down in black and white, no nasty surprises.",
      },
    },
    {
      title: { fr: "Rapide et sur-mesure", en: "Fast and bespoke" },
      desc: {
        fr: "Un site livré en 7 jours, conçu pour votre métier — jamais un template générique.",
        en: "A site delivered in 7 days, built around your trade — never a generic template.",
      },
    },
    {
      title: { fr: "Disponible après la livraison", en: "Available after delivery" },
      desc: {
        fr: "Quelqu'un de responsable reste là pour vos modifications et vos évolutions.",
        en: "Someone accountable stays there for your edits and your future changes.",
      },
    },
  ],
  // Réseaux : ne remplissez que ceux que vous utilisez (les vides ne s'affichent pas).
  socials: {
    email: "allonzopensa@gmail.com",
    whatsapp: "", // ex. "https://wa.me/33XXXXXXXXX"
    instagram: "", // ex. "https://instagram.com/votre_compte"
  },
} as const;
