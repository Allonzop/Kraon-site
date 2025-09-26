import { motion } from "framer-motion";
import { useParams, Link } from "wouter";
import { ArrowLeft, Globe, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function ProjectDetail() {
  const { t } = useLanguage();
  const params = useParams();
  
  // For now, we'll show Wear the Vision details regardless of ID
  // In a real app, you'd fetch project data based on the ID
  
  const projectData = {
    title: "Wear the Vision",
    subtitle: t("language") === "fr" ? "Casquettes Premium Durables" : "Premium Sustainable Caps",
    url: "wear-the-vision.fr",
    category: "E-commerce",
    year: "2024",
    description: t("language") === "fr" 
      ? "Création d'une boutique e-commerce premium spécialisée dans les casquettes durables. Design moderne, UX optimisée et stratégie marketing complète."
      : "Creation of a premium e-commerce store specializing in sustainable caps. Modern design, optimized UX and complete marketing strategy.",
    
    challenges: t("language") === "fr" ? [
      "Positionnement premium sur un marché concurrentiel",
      "Communication de la valeur durable",
      "Optimisation des conversions e-commerce",
      "Création d'une identité de marque forte"
    ] : [
      "Premium positioning in a competitive market",
      "Communicating sustainable value",
      "E-commerce conversion optimization", 
      "Creating strong brand identity"
    ],
    
    solutions: t("language") === "fr" ? [
      "Design épuré et moderne avec focus sur la durabilité",
      "Storytelling autour des valeurs écologiques",
      "Parcours d'achat optimisé et intuitif",
      "Stratégie de contenu engageante sur les réseaux"
    ] : [
      "Clean and modern design focused on sustainability",
      "Storytelling around ecological values",
      "Optimized and intuitive purchase journey",
      "Engaging content strategy on social networks"
    ],
    
    results: {
      conversionRate: "+187%",
      organicTraffic: "+245%", 
      averageBasket: "€67",
      retentionRate: "73%"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-8 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#work">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t("language") === "fr" ? "Retour aux projets" : "Back to projects"}
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">WTV</span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{projectData.title}</h1>
                <p className="text-lg text-muted-foreground">{projectData.subtitle}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {projectData.url}
              </span>
              <span>•</span>
              <span>{projectData.category}</span>
              <span>•</span>
              <span>{projectData.year}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold">WTV</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{projectData.title}</h3>
                <p className="text-white/80">{t("language") === "fr" ? "Futur | Durable | Libre" : "Future | Sustainable | Free"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                {t("language") === "fr" ? "Vue d'ensemble" : "Project Overview"}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {projectData.description}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{t("language") === "fr" ? "100% matières recyclées" : "100% recycled materials"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>{t("language") === "fr" ? "387L d'eau économisés par casquette" : "387L water saved per cap"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{t("language") === "fr" ? "Expédition sans plastique" : "Plastic-free shipping"}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {Object.entries(projectData.results).map(([key, value], index) => (
                <div key={key} className="glass p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{value}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-accent" />
                {t("language") === "fr" ? "Défis" : "Challenges"}
              </h3>
              <div className="space-y-4">
                {projectData.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{challenge}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                {t("language") === "fr" ? "Solutions" : "Solutions"}
              </h3>
              <div className="space-y-4">
                {projectData.solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{solution}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("language") === "fr" ? "Prêt à booster votre e-commerce ?" : "Ready to boost your e-commerce?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("language") === "fr" 
                ? "Discutons de votre projet et créons ensemble une expérience client exceptionnelle." 
                : "Let's discuss your project and create an exceptional customer experience together."}
            </p>
            <Link href="/#contact">
              <Button size="lg" className="text-lg px-8">
                {t("language") === "fr" ? "Démarrer un projet" : "Start a project"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}