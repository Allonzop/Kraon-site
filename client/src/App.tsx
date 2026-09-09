import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./lib/i18n";
import { Router, Route, Switch } from "wouter";
import Home from "@/pages/home";

/*
 * Seule la page d'accueil est chargée d'emblée : c'est la porte d'entrée du
 * site. Toutes les autres pages sont découpées en morceaux chargés à la
 * demande, ce qui allège nettement le premier chargement sans rien retirer
 * du contenu ni des animations.
 */
const ProjectDetail = lazy(() => import("@/pages/project-detail"));
const AuditGratuit = lazy(() => import("@/pages/audit-gratuit"));
const Offre = lazy(() => import("@/pages/offre"));
const AboutMe = lazy(() => import("@/pages/about-me"));
const NotFound = lazy(() => import("@/pages/not-found"));
const DataVizPro = lazy(() => import("@/pages/dataviz-pro"));
const MentionsLegales = lazy(() => import("@/pages/legal").then((m) => ({ default: m.MentionsLegales })));
const Cgv = lazy(() => import("@/pages/legal").then((m) => ({ default: m.Cgv })));
const Confidentialite = lazy(() => import("@/pages/legal").then((m) => ({ default: m.Confidentialite })));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            {/* Écran de transition neutre : évite tout flash pendant le chargement d'une page. */}
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/audit-gratuit" component={AuditGratuit} />
                <Route path="/offre" component={Offre} />
                <Route path="/a-propos" component={AboutMe} />
                <Route path="/mentions-legales" component={MentionsLegales} />
                <Route path="/cgv" component={Cgv} />
                <Route path="/confidentialite" component={Confidentialite} />
                <Route path="/showcase/dataviz-pro" component={DataVizPro} />
                <Route path="/project/:id" component={ProjectDetail} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Router>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
