/**
 * Identité de l'éditeur et paramètres juridiques — SOURCE UNIQUE.
 *
 * Les pages /mentions-legales, /cgv et /confidentialite sont rendues à partir
 * de ce fichier. Renseignez ici, une seule fois, les champs marqués `TODO`.
 * Tant qu'un champ requis vaut `TODO`, un bandeau « mentions incomplètes »
 * s'affiche en haut des pages légales (voir legal.tsx) pour éviter toute
 * publication non conforme par accident.
 *
 * Décisions actées par le porteur :
 *  - Vente B2B uniquement → pas de droit de rétractation ni de médiation conso.
 *  - Non assujetti à la TVA (micro-entreprise) → « TVA non applicable, art. 293 B ».
 *  - Hébergement des sites livrés : à la charge du client (le Prestataire
 *    configure/livre le code et conseille, sans porter l'hébergement).
 */

/** Valeur sentinelle : un champ à renseigner par l'éditeur. */
export const TODO = "à compléter" as const;

export const LEGAL = {
  // ------- Identité de l'éditeur (this site) -------
  enseigne: "KRAON",
  denominationLegale: "KRAON",
  statut: "Micro-entreprise (entrepreneur individuel)", // à confirmer
  capital: "", // Vide pour une entreprise individuelle
  siren: "", // 9 chiffres — à ajouter dès l'immatriculation (obligatoire sur les mentions légales)
  siret: "", // 14 chiffres — à ajouter dès l'immatriculation
  rcs: "", // Ex. « Paris » si société commerciale ; vide sinon
  adresse: "79 rue Émile Zola, 08000 Charleville-Mézières", // code postal / ville à confirmer
  email: "allonzopensa@gmail.com",
  telephone: "", // à ajouter (obligatoire pour un vendeur en ligne — LCEN)
  directeurPublication: "", // Masqué tant que vide
  tvaMention: "TVA non applicable, article 293 B du Code général des impôts",

  // ------- Hébergeur de CE site (déployé sur Netlify) -------
  hebergeur: {
    nom: "Netlify, Inc.",
    adresse: "512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis",
    contact: "https://www.netlify.com",
  },

  // ------- Juridiction (B2B) -------
  tribunalVille: "Charleville-Mézières", // Tribunal compétent (siège du Prestataire)

  // ------- Dates & versions -------
  lastUpdated: "18 août 2026",
  cgvVersion: "1.0",

  // ------- Termes de la prestation (repris dans les CGV) -------
  prix: 450,
  prixApres: 650,
  quota: 20,
  acomptePct: 50,
  delaiLivraison: 7, // jours ouvrés
  revisions: 2,
  garantieJours: 30,
  delaiValidationMaquette: 7,
  delaiCarence: 30, // jours avant résiliation pour carence du client
  nbPages: "jusqu'à 5 pages", // à confirmer

  // ------- Sous-traitants (politique de confidentialité) -------
  sousTraitants: [
    { nom: "Netlify, Inc.", role: "Hébergement du site", zone: "États-Unis" },
    { nom: "Stripe Payments Europe", role: "Traitement des paiements", zone: "Union européenne / États-Unis" },
    { nom: "Notion Labs, Inc.", role: "Gestion de la relation client", zone: "États-Unis" },
    { nom: "Google (Gmail)", role: "Envoi et réception des e-mails", zone: "États-Unis" },
  ],
} as const;

export type LegalConfig = typeof LEGAL;

/** Un champ requis est-il encore à renseigner ? */
export function isTodo(value: string): boolean {
  return value === TODO || value.trim() === "";
}

/**
 * Champs légalement attendus mais volontairement laissés vides pour l'instant
 * (à ajouter dès l'immatriculation). Sert uniquement à un rappel affiché en
 * développement — jamais en production (voir legal.tsx).
 */
export const REQUIRED_FIELDS: { key: keyof LegalConfig; label: string }[] = [
  { key: "siren", label: "SIREN" },
  { key: "siret", label: "SIRET" },
  { key: "telephone", label: "Téléphone" },
];

/** Liste des champs légaux encore vides (rappel en dev). */
export function missingLegalFields(): string[] {
  return REQUIRED_FIELDS.filter(({ key }) => isTodo(LEGAL[key] as string)).map((f) => f.label);
}
