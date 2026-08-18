import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./lib/i18n";
import { Router, Route, Switch } from "wouter";
import Home from "@/pages/home";
import ProjectDetail from "@/pages/project-detail";
import AuditGratuit from "@/pages/audit-gratuit";
import Offre from "@/pages/offre";
import { MentionsLegales, Cgv, Confidentialite } from "@/pages/legal";
import NotFound from "@/pages/not-found";

// Charts-heavy demo — code-split so recharts only loads when the demo is opened.
const DataVizPro = lazy(() => import("@/pages/dataviz-pro"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/audit-gratuit" component={AuditGratuit} />
              <Route path="/offre" component={Offre} />
              <Route path="/mentions-legales" component={MentionsLegales} />
              <Route path="/cgv" component={Cgv} />
              <Route path="/confidentialite" component={Confidentialite} />
              <Route path="/showcase/dataviz-pro">
                <Suspense fallback={<div className="min-h-screen bg-background" />}>
                  <DataVizPro />
                </Suspense>
              </Route>
              <Route path="/project/:id" component={ProjectDetail} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
