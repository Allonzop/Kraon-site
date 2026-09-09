import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    "nav.services": "Services",
    "nav.work": "Work", 
    "nav.process": "Process",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.consultation": "Request Consultation",
    
    // Hero
    "hero.badge": "Available for new projects",
    "hero.headline": "Professional websites for skilled artisans",
    "hero.subtext": "A polished, fast website that showcases your craft and brings in new clients.",
    "hero.cta.proposal": "Get a Proposal",
    "hero.cta.work": "See Work",
    
    // Services
    "services.title": "Our two",
    "services.titleAccent": "specialties",
    "services.subtitle": "Websites that bring you clients, automations that give you back your time.",
    "services.group.web": "Website creation",
    "services.group.ai": "AI & automation",
    "tools.label": "Tools we work with",
    "services.flipHint": "What's in it for you",
    "services.web1.title": "Bespoke website",
    "services.web1.desc": "A site built around your business — never a generic template",
    "services.web1.value": "A first impression that inspires trust and turns visitors into clients.",
    "services.web2.title": "Redesign & modernization",
    "services.web2.desc": "Your existing site brought up to standard: fast, mobile, up to date",
    "services.web2.value": "Your site back up to today's standard — without starting from scratch.",
    "services.web3.title": "Visibility & search",
    "services.web3.desc": "Clean technical foundations so customers actually find you",
    "services.web3.value": "Customers find you on Google, without paying for every click.",
    "services.ai1.title": "Task automation",
    "services.ai1.desc": "Your repetitive workflows handled automatically, end to end",
    "services.ai1.value": "Repetitive work runs on its own — you get your hours back.",
    "services.ai2.title": "AI agents & assistants",
    "services.ai2.desc": "Assistants that answer, sort and prepare the work for you",
    "services.ai2.value": "Requests handled around the clock, so nothing slips through.",
    "services.ai3.title": "Tool integration",
    "services.ai3.desc": "Your existing tools connected so data flows without manual work",
    "services.ai3.value": "Your tools finally talk to each other: no more double entry.",
    
    // Work
    "work.title": "Featured Work",
    "work.subtitle": "Bespoke projects — premium websites, e-commerce and products — built to convert",
    "work.viewDetails": "View Details",
    
    // Process
    "process.title": "Our Process",
    "process.subtitle": "A simple method, from the first conversation to going live",
    "process.discover.title": "Discover",
    "process.discover.desc": "We map your business, your clients, and where you lose time or leads",
    "process.discover.timeline": "Step 1",
    "process.plan.title": "Design",
    "process.plan.desc": "A concrete plan and a mockup you validate before anything is built",
    "process.plan.timeline": "Step 2",
    "process.execute.title": "Build",
    "process.execute.desc": "Your site or your automation is built, tested and put live",
    "process.execute.timeline": "Step 3",
    "process.optimize.title": "Support",
    "process.optimize.desc": "Adjustments, improvements, and someone reachable after delivery",
    "process.optimize.timeline": "Ongoing",
    
    // About
    
    // Contact
    "contact.title": "Start Your Growth Journey",
    "contact.subtitle": "Ready to scale your business? Let's discuss how we can accelerate your growth.",
    "contact.form.name": "Name",
    "contact.form.company": "Company",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.message": "Message",
    "contact.form.consent": "I agree to receive communications from KRAON and understand that I can unsubscribe at any time.",
    "contact.form.submit": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success.title": "Message Sent!",
    "contact.form.success.desc": "We'll get back to you within 24 hours.",
    "contact.placeholder.name": "Your full name",
    "contact.placeholder.company": "Your company name",
    "contact.placeholder.email": "your@email.com",
    "contact.placeholder.phone": "+1 (555) 123-4567",
    "contact.placeholder.message": "Tell us about your business goals and how we can help...",
    "contact.success.title": "Message Sent!",
    "contact.success.subtitle": "We'll get back to you within 24 hours.",
    "contact.success.toast.title": "Message sent successfully",
    "contact.success.toast.description": "Thanks for reaching out — we'll reply within 24 hours.",
    "contact.error.toast.title": "Something went wrong",
    "contact.error.toast.description": "Your message couldn't be sent. Please try again in a moment.",
    "contact.validation.nameRequired": "Name is required",
    "contact.validation.nameMin": "Name must be at least 2 characters",
    "contact.validation.companyRequired": "Company is required",
    "contact.validation.companyMin": "Company must be at least 2 characters",
    "contact.validation.emailRequired": "Email is required",
    "contact.validation.emailInvalid": "Please enter a valid email address",
    "contact.validation.messageRequired": "Message is required",
    "contact.validation.messageMin": "Message must be at least 10 characters",
    "contact.validation.consentRequired": "You must agree to receive communications",

    // Footer
    "footer.tagline": "Websites & AI automation",
    "footer.description": "Bespoke websites and AI automation — built to bring you clients and give you back your time.",
    "footer.navTitle": "Navigation",
    "footer.ctaTitle": "Ready to grow?",
    "footer.cta": "Start a project",
    "footer.rights": "© 2024 KRAON. All rights reserved."
  },
  fr: {
    // Header
    "nav.services": "Services",
    "nav.work": "Réalisations",
    "nav.process": "Processus",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.consultation": "Demander une consultation",
    
    // Hero
    "hero.badge": "Disponible pour de nouveaux projets",
    "hero.headline": "Des sites internet sur-mesure pour les artisans",
    "hero.subtext": "Une vitrine professionnelle, rapide et soignée, qui met votre savoir-faire en valeur et vous apporte des clients.",
    "hero.cta.proposal": "Demander une proposition",
    "hero.cta.work": "Voir nos réalisations",
    
    // Services
    "services.title": "Nos deux",
    "services.titleAccent": "spécialités",
    "services.subtitle": "Des sites qui vous apportent des clients, des automatisations qui vous rendent du temps.",
    "services.group.web": "Création de sites internet",
    "services.group.ai": "IA & automatisation",
    "tools.label": "Les outils que nous maîtrisons",
    "services.flipHint": "Ce que ça vous apporte",
    "services.web1.title": "Site sur-mesure",
    "services.web1.desc": "Un site pensé pour votre métier — jamais un template générique",
    "services.web1.value": "Une première impression qui inspire confiance et transforme vos visiteurs en clients.",
    "services.web2.title": "Refonte & modernisation",
    "services.web2.desc": "Votre site actuel remis à niveau : rapide, mobile, à jour",
    "services.web2.value": "Votre site remis au niveau d'aujourd'hui, sans repartir de zéro.",
    "services.web3.title": "Visibilité & référencement",
    "services.web3.desc": "Des bases techniques saines pour que vos clients vous trouvent",
    "services.web3.value": "Vos clients vous trouvent sur Google, sans payer chaque clic.",
    "services.ai1.title": "Automatisation des tâches",
    "services.ai1.desc": "Vos tâches répétitives prises en charge de bout en bout",
    "services.ai1.value": "Le travail répétitif tourne tout seul — vous récupérez vos heures.",
    "services.ai2.title": "Agents & assistants IA",
    "services.ai2.desc": "Des assistants qui répondent, trient et préparent le travail à votre place",
    "services.ai2.value": "Les demandes sont traitées en continu, plus rien ne passe à la trappe.",
    "services.ai3.title": "Intégration à vos outils",
    "services.ai3.desc": "Vos outils existants connectés pour que les données circulent seules",
    "services.ai3.value": "Vos outils se parlent enfin : fini la double saisie.",
    
    // Work
    "work.title": "Études de Cas",
    "work.subtitle": "Des projets sur-mesure — sites premium, e-commerce et produits — pensés pour convertir",
    "work.viewDetails": "Voir les détails",
    
    // Process
    "process.title": "Notre Processus",
    "process.subtitle": "Une méthode simple, du premier échange à la mise en ligne",
    "process.discover.title": "Découverte",
    "process.discover.desc": "On cartographie votre activité, vos clients, et là où vous perdez du temps ou des demandes",
    "process.discover.timeline": "Étape 1",
    "process.plan.title": "Conception",
    "process.plan.desc": "Un plan concret et une maquette que vous validez avant toute réalisation",
    "process.plan.timeline": "Étape 2",
    "process.execute.title": "Réalisation",
    "process.execute.desc": "Votre site ou votre automatisation est construit, testé et mis en ligne",
    "process.execute.timeline": "Étape 3",
    "process.optimize.title": "Suivi",
    "process.optimize.desc": "Ajustements, améliorations, et quelqu'un de joignable après la livraison",
    "process.optimize.timeline": "En continu",
    
    // About
    
    // Contact
    "contact.title": "Prêt à Booster Votre Croissance ?",
    "contact.subtitle": "Vous souhaitez faire passer votre entreprise au niveau supérieur ? Discutons ensemble de la meilleure façon d'accélérer vos résultats.",
    "contact.form.name": "Nom",
    "contact.form.company": "Entreprise",
    "contact.form.email": "Email",
    "contact.form.phone": "Téléphone",
    "contact.form.message": "Message",
    "contact.form.consent": "J'accepte de recevoir les communications de KRAON et comprends que je peux me désinscrire à tout moment.",
    "contact.form.submit": "Envoyer le message",
    "contact.form.sending": "Envoi en cours...",
    "contact.form.success.title": "Message envoyé !",
    "contact.form.success.desc": "Nous vous recontacterons sous 24 heures.",
    "contact.placeholder.name": "Votre nom complet",
    "contact.placeholder.company": "Nom de votre entreprise",
    "contact.placeholder.email": "votre@email.com",
    "contact.placeholder.phone": "+33 1 23 45 67 89",
    "contact.placeholder.message": "Parlez-nous de vos objectifs business et comment nous pouvons vous aider...",
    "contact.success.title": "Message envoyé !",
    "contact.success.subtitle": "Nous vous recontacterons sous 24 heures.",
    "contact.success.toast.title": "Message envoyé avec succès",
    "contact.success.toast.description": "Merci de nous avoir contactés — nous vous répondrons sous 24 heures.",
    "contact.error.toast.title": "Une erreur est survenue",
    "contact.error.toast.description": "Votre message n'a pas pu être envoyé. Merci de réessayer dans un instant.",
    "contact.validation.nameRequired": "Le nom est requis",
    "contact.validation.nameMin": "Le nom doit contenir au moins 2 caractères",
    "contact.validation.companyRequired": "L'entreprise est requise",
    "contact.validation.companyMin": "L'entreprise doit contenir au moins 2 caractères",
    "contact.validation.emailRequired": "L'email est requis",
    "contact.validation.emailInvalid": "Veuillez saisir une adresse email valide",
    "contact.validation.messageRequired": "Le message est requis",
    "contact.validation.messageMin": "Le message doit contenir au moins 10 caractères",
    "contact.validation.consentRequired": "Vous devez accepter de recevoir nos communications",

    // Footer
    "footer.tagline": "Sites internet & automatisation IA",
    "footer.description": "Des sites internet sur-mesure et des automatisations IA — pensés pour vous apporter des clients et vous rendre du temps.",
    "footer.navTitle": "Navigation",
    "footer.ctaTitle": "Prêt à passer à l'action ?",
    "footer.cta": "Démarrer un projet",
    "footer.rights": "© 2024 KRAON. Tous droits réservés."
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  // Keep the document language in sync for accessibility & SEO.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}