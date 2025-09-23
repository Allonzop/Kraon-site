import { createContext, useContext, useState, ReactNode } from "react";

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
    "hero.headline": "Premium Digital Marketing for Ambitious SMEs",
    "hero.subtext": "Strategy, performance, and design — tailored to your growth.",
    "hero.cta.proposal": "Get a Proposal",
    "hero.cta.work": "See Work",
    
    // Services
    "services.title": "Strategic Services",
    "services.subtitle": "Comprehensive digital solutions designed to accelerate your business growth",
    "services.strategy.title": "Strategy",
    "services.strategy.desc": "Data-driven growth strategies that align with your business objectives",
    "services.ads.title": "Paid Ads",
    "services.ads.desc": "High-performance campaigns across Google, Meta, and LinkedIn",
    "services.seo.title": "SEO",
    "services.seo.desc": "Organic visibility optimization for sustainable long-term growth",
    "services.content.title": "Content & Social",
    "services.content.desc": "Engaging content strategies that build communities and drive conversions",
    "services.design.title": "Web Design",
    "services.design.desc": "Premium websites that convert visitors into customers",
    "services.analytics.title": "Analytics",
    "services.analytics.desc": "Advanced tracking and insights to optimize every touchpoint",
    
    // Work
    "work.title": "Featured Work",
    "work.subtitle": "Case studies of transformative digital campaigns for ambitious brands",
    "work.project1.title": "TechFlow Solutions",
    "work.project1.category": "E-commerce",
    "work.project1.result": "350% ROAS increase in 6 months",
    "work.project2.title": "DataViz Pro", 
    "work.project2.category": "SaaS",
    "work.project2.result": "5x lead generation growth",
    "work.project3.title": "MedTech Innovations",
    "work.project3.category": "Healthcare",
    "work.project3.result": "200% organic traffic increase",
    "work.project4.title": "CryptoWave Exchange",
    "work.project4.category": "Fintech", 
    "work.project4.result": "10x conversion rate optimization",
    "work.viewDetails": "View Details",
    
    // Process
    "process.title": "Our Process",
    "process.subtitle": "A proven methodology that delivers consistent results for our clients",
    "process.discover.title": "Discover",
    "process.discover.desc": "Deep-dive analysis of your business, market, and opportunities",
    "process.discover.timeline": "Week 1-2",
    "process.plan.title": "Plan",
    "process.plan.desc": "Strategic roadmap with clear milestones and KPI targets",
    "process.plan.timeline": "Week 2-3",
    "process.execute.title": "Execute",
    "process.execute.desc": "Implementation of campaigns with real-time monitoring",
    "process.execute.timeline": "Week 4+",
    "process.optimize.title": "Optimize",
    "process.optimize.desc": "Continuous improvement based on data and performance insights",
    "process.optimize.timeline": "Ongoing",
    
    // About
    "about.title": "About KRAON",
    "about.description": "We're a premium digital marketing agency exclusively focused on ambitious SMEs. Our data-driven approach and cutting-edge strategies have helped hundreds of businesses scale from startup to market leader. We don't just run campaigns—we build growth engines.",
    "about.badge1.value": "5+",
    "about.badge1.label": "Years Experience",
    "about.badge2.value": "400%",
    "about.badge2.label": "Avg ROAS Increase",
    "about.badge3.value": "<24h",
    "about.badge3.label": "Response Time",
    "about.team1.name": "Sarah Chen",
    "about.team1.role": "Strategy Director",
    "about.team2.name": "Marcus Rivera",
    "about.team2.role": "Performance Lead",
    "about.team3.name": "Emma Thompson",
    "about.team3.role": "Creative Director",
    "about.team4.name": "Alex Kumar", 
    "about.team4.role": "Analytics Specialist",
    
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
    
    // Footer
    "footer.tagline": "Premium Digital Marketing for Ambitious SMEs",
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
    "hero.headline": "Marketing digital premium pour les PME ambitieuses",
    "hero.subtext": "Stratégie, performance et design — pensés pour votre croissance.",
    "hero.cta.proposal": "Demander une proposition",
    "hero.cta.work": "Voir nos réalisations",
    
    // Services
    "services.title": "Nos Services Stratégiques",
    "services.subtitle": "Des solutions digitales complètes pour accélérer la croissance de votre entreprise",
    "services.strategy.title": "Stratégie",
    "services.strategy.desc": "Des plans de croissance basés sur la donnée, alignés sur vos objectifs",
    "services.ads.title": "Publicité en ligne",
    "services.ads.desc": "Des campagnes performantes sur Google, Meta et LinkedIn",
    "services.seo.title": "SEO",
    "services.seo.desc": "Optimisation de votre visibilité organique pour une croissance durable",
    "services.content.title": "Contenu & Réseaux sociaux",
    "services.content.desc": "Des stratégies engageantes qui fédèrent vos communautés et génèrent des conversions",
    "services.design.title": "Web Design",
    "services.design.desc": "Des sites web premium qui transforment vos visiteurs en clients",
    "services.analytics.title": "Analytics",
    "services.analytics.desc": "Un suivi avancé et des insights précis pour optimiser chaque étape du parcours client",
    
    // Work
    "work.title": "Études de Cas",
    "work.subtitle": "Exemples de campagnes digitales qui ont transformé des marques ambitieuses",
    "work.project1.title": "TechFlow Solutions",
    "work.project1.category": "E-commerce",
    "work.project1.result": "+350% de retour sur dépenses publicitaires en 6 mois",
    "work.project2.title": "DataViz Pro",
    "work.project2.category": "SaaS",
    "work.project2.result": "Croissance x5 en génération de leads",
    "work.project3.title": "MedTech Innovations",
    "work.project3.category": "Santé",
    "work.project3.result": "+200% de trafic organique en un an",
    "work.project4.title": "CryptoWave Exchange",
    "work.project4.category": "Fintech",
    "work.project4.result": "Taux de conversion multiplié par 10",
    "work.viewDetails": "Voir les détails",
    
    // Process
    "process.title": "Notre Processus",
    "process.subtitle": "Une méthodologie éprouvée qui garantit des résultats constants",
    "process.discover.title": "Découverte",
    "process.discover.desc": "Analyse approfondie de votre entreprise, de votre marché et des opportunités",
    "process.discover.timeline": "Semaines 1-2",
    "process.plan.title": "Planification",
    "process.plan.desc": "Feuille de route stratégique avec jalons clairs et objectifs mesurables",
    "process.plan.timeline": "Semaines 2-3",
    "process.execute.title": "Exécution",
    "process.execute.desc": "Lancement des campagnes avec suivi en temps réel",
    "process.execute.timeline": "Semaine 4 et +",
    "process.optimize.title": "Optimisation",
    "process.optimize.desc": "Amélioration continue basée sur les données et la performance",
    "process.optimize.timeline": "En continu",
    
    // About
    "about.title": "À propos de KRAON",
    "about.description": "Nous sommes une agence de marketing digital premium, dédiée exclusivement aux PME ambitieuses. Notre approche data-driven et nos stratégies innovantes ont permis à des centaines d'entreprises de passer du statut de startup à celui de leader de marché. Nous ne lançons pas seulement des campagnes — nous construisons de véritables moteurs de croissance.",
    "about.badge1.value": "5+",
    "about.badge1.label": "années d'expérience",
    "about.badge2.value": "+400%",
    "about.badge2.label": "de ROAS en moyenne",
    "about.badge3.value": "< 24h",
    "about.badge3.label": "de temps de réponse",
    "about.team1.name": "Sarah Chen",
    "about.team1.role": "Directrice Stratégie",
    "about.team2.name": "Marcus Rivera",
    "about.team2.role": "Responsable Performance",
    "about.team3.name": "Emma Thompson",
    "about.team3.role": "Directrice Créative",
    "about.team4.name": "Alex Kumar",
    "about.team4.role": "Spécialiste Analytics",
    
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
    
    // Footer
    "footer.tagline": "Marketing digital premium pour les PME ambitieuses",
    "footer.rights": "© 2024 KRAON. Tous droits réservés."
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

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