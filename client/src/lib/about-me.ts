/**
 * Contenu de la page « À propos » (/a-propos) — SOURCE UNIQUE, éditable.
 *
 * Personnalisez librement les textes ci-dessous. Pour la photo :
 * déposez votre portrait professionnel dans `client/public/assets/portrait.jpg`
 * (idéalement la MÊME photo que sur WhatsApp / Instagram / vos e-mails, pour
 * que le client reconnaisse votre visage partout). Tant que le fichier n'existe
 * pas, un visuel de remplacement s'affiche automatiquement.
 */
export const ABOUT = {
  name: "Allonzo", // Prénom affiché — à confirmer
  role: "Créateur de sites internet pour artisans",
  location: "Charleville-Mézières",
  photo: "/assets/portrait.jpg", // Déposez votre photo ici (voir en-tête de ce fichier)
  tagline: "Un site pro, fait par une vraie personne — pas une usine à sites.",
  intro: [
    "Derrière KRAON, il y a une personne, pas un standard. Quand vous écrivez, c'est moi qui réponds, qui conçois votre site, et qui reste joignable après la livraison.",
    "Je crée des sites internet sur-mesure pour les artisans et les petites entreprises : des vitrines claires, rapides et soignées, qui inspirent confiance et donnent envie de vous appeler.",
  ],
  steps: [
    {
      title: "On échange",
      desc: "Un premier contact simple pour comprendre votre métier, vos clients et ce que vous attendez de votre site.",
    },
    {
      title: "Je conçois une maquette",
      desc: "Je vous montre à quoi ressemblera votre site avant tout engagement. Vous voyez, vous ajustez.",
    },
    {
      title: "Vous validez",
      desc: "Rien n'est mis en ligne sans votre accord. Les révisions sont incluses jusqu'à ce que ce soit juste.",
    },
    {
      title: "Je livre",
      desc: "Votre site en ligne en 7 jours, configuré et prêt à recevoir vos clients.",
    },
    {
      title: "Je reste là",
      desc: "Après la livraison, je reste joignable pour les évolutions et les petites modifications.",
    },
  ],
  reasons: [
    {
      title: "Un vrai visage",
      desc: "Vous savez à qui vous parlez. La même photo sur le site, dans mes e-mails et sur mes réseaux — aucun anonymat.",
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
      title: "Disponible après la vente",
      desc: "Je ne disparais pas une fois le site livré. Vous avez quelqu'un de responsable en face.",
    },
  ],
  // Réseaux : ne remplissez que ceux que vous utilisez (les vides ne s'affichent pas).
  socials: {
    email: "allonzopensa@gmail.com",
    whatsapp: "", // ex. "https://wa.me/33XXXXXXXXX"
    instagram: "", // ex. "https://instagram.com/votre_compte"
  },
} as const;
