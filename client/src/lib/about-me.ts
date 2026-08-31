/**
 * Contenu de la page « À propos » (/a-propos) — SOURCE UNIQUE, éditable.
 *
 * Pour la photo : déposez votre portrait dans `client/public/assets/portrait.jpg`
 * (idéalement la MÊME que sur WhatsApp / Instagram / vos e-mails). Tant que le
 * fichier n'existe pas, un visuel de remplacement s'affiche automatiquement.
 *
 * Le ton est volontairement centré sur le client (« vous »), pas sur soi.
 */
export const ABOUT = {
  name: "Allonzo", // Prénom affiché — à confirmer
  role: "Créateur de sites internet pour artisans",
  location: "Charleville-Mézières",
  photo: "/assets/portrait.jpg",
  headline: "Un interlocuteur unique, du premier message à la livraison",
  tagline:
    "Pas d'agence anonyme, pas de standard : la personne qui vous répond est celle qui conçoit votre site.",
  intro: [
    "Chez KRAON, vous avez un seul interlocuteur. Celui qui vous répond est celui qui dessine, développe et met votre site en ligne — et qui reste joignable ensuite.",
    "L'objectif n'est pas de faire « joli », mais de vous apporter des clients : une vitrine claire, rapide et rassurante, pensée pour votre métier.",
  ],
  steps: [
    {
      title: "On échange",
      desc: "Un premier contact simple pour comprendre votre métier, vos clients et ce que vous attendez de votre site.",
    },
    {
      title: "Vous voyez une maquette",
      desc: "Vous découvrez à quoi ressemblera votre site avant tout engagement. Vous voyez, vous ajustez.",
    },
    {
      title: "Vous validez",
      desc: "Rien n'est mis en ligne sans votre accord. Les révisions sont incluses jusqu'à ce que ce soit juste.",
    },
    {
      title: "C'est livré",
      desc: "Votre site en ligne en 7 jours, configuré et prêt à recevoir vos clients.",
    },
    {
      title: "On reste en contact",
      desc: "Après la livraison, vous gardez un interlocuteur disponible pour vos évolutions et vos questions.",
    },
  ],
  reasons: [
    {
      title: "Un interlocuteur unique",
      desc: "Vous savez toujours à qui vous parlez, du devis au suivi — pas de service client anonyme.",
    },
    {
      title: "Transparence totale",
      desc: "Prix clairs, périmètre écrit noir sur blanc, aucune mauvaise surprise.",
    },
    {
      title: "Rapide et sur-mesure",
      desc: "Un site livré en 7 jours, conçu pour votre métier — jamais un template générique.",
    },
    {
      title: "Disponible après la livraison",
      desc: "Quelqu'un de responsable reste là pour vos modifications et vos évolutions.",
    },
  ],
  // Réseaux : ne remplissez que ceux que vous utilisez (les vides ne s'affichent pas).
  socials: {
    email: "allonzopensa@gmail.com",
    whatsapp: "", // ex. "https://wa.me/33XXXXXXXXX"
    instagram: "", // ex. "https://instagram.com/votre_compte"
  },
} as const;
