import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { LEGAL, isTodo, missingLegalFields } from "@/lib/legal-info";

/* ------------------------------------------------------------------ *
 * Coquille commune aux pages légales : nav épurée, contenu en prose,
 * bandeau d'alerte si des champs obligatoires manquent, inter-liens.
 * ------------------------------------------------------------------ */

/**
 * Rend un champ. En développement, un champ vide est surligné en ambre pour
 * signaler qu'il reste à compléter ; en production, il n'affiche rien (le
 * public ne voit jamais de « à compléter »).
 */
function Val({ value, label }: { value: string; label?: string }) {
  if (isTodo(value)) {
    if (!import.meta.env.DEV) return null;
    return (
      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-medium text-amber-300">
        [{label ?? "à compléter"}]
      </span>
    );
  }
  return <>{value}</>;
}

const legalPages = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
];

function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  const missing = missingLegalFields();

  useEffect(() => {
    const prev = document.title;
    document.title = `${title} — KRAON`;
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, [title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav épurée */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="KRAON"
              width={32}
              height={32}
              className="h-7 w-7 rounded-sm object-contain ring-1 ring-white/10 sm:h-8 sm:w-8"
              loading="eager"
              decoding="async"
            />
            <span className="text-lg font-bold sm:text-xl">KRAON</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        {/* Rappel visible en développement uniquement — jamais pour le public. */}
        {import.meta.env.DEV && missing.length > 0 && (
          <div className="mb-8 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold text-amber-100">Rappel (dev) — champs légaux à ajouter bientôt</p>
              <p className="mt-1">
                Encore vides : {missing.join(", ")}. À renseigner dès l'immatriculation dans{" "}
                <code className="rounded bg-black/30 px-1">client/src/lib/legal-info.ts</code>. Ce rappel n'est pas
                visible en production.
              </p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {LEGAL.lastUpdated}</p>

        <div
          className="prose prose-invert mt-8 max-w-none prose-headings:font-bold prose-h2:mt-10 prose-h2:text-xl prose-h3:text-base prose-a:text-primary prose-strong:text-foreground prose-th:text-foreground"
        >
          {children}
        </div>

        {/* Inter-liens */}
        <nav className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/50 pt-6 text-sm">
          {legalPages.map((p) => (
            <Link key={p.href} href={p.href} className="text-muted-foreground transition-colors hover:text-primary">
              {p.label}
            </Link>
          ))}
          <Link href="/offre" className="text-muted-foreground transition-colors hover:text-primary">
            Offre de lancement
          </Link>
        </nav>
      </main>
    </div>
  );
}

/** Bloc d'identité de l'éditeur, réutilisé sur plusieurs pages. */
function IdentityBlock() {
  return (
    <p>
      <strong>
        <Val value={LEGAL.denominationLegale} label="Dénomination / nom de l'éditeur" />
      </strong>
      <br />
      Statut juridique : {LEGAL.statut}
      {LEGAL.capital && (
        <>
          <br />
          Capital social : {LEGAL.capital}
        </>
      )}
      <br />
      Siège social : <Val value={LEGAL.adresse} label="adresse du siège" />
      {!isTodo(LEGAL.siren) && (
        <>
          <br />
          SIREN : {LEGAL.siren}
        </>
      )}
      {!isTodo(LEGAL.siret) && (
        <>
          <br />
          SIRET : {LEGAL.siret}
        </>
      )}
      {LEGAL.rcs && (
        <>
          <br />
          RCS : {LEGAL.rcs}
        </>
      )}
      <br />
      {LEGAL.tvaMention}
      <br />
      Adresse électronique : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
      {!isTodo(LEGAL.telephone) && (
        <>
          <br />
          Téléphone : {LEGAL.telephone}
        </>
      )}
    </p>
  );
}

/* ================================================================== *
 * MENTIONS LÉGALES
 * ================================================================== */
export function MentionsLegales() {
  return (
    <LegalShell title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>Le présent site est édité par :</p>
      <IdentityBlock />
      {!isTodo(LEGAL.directeurPublication) && (
        <p>
          <strong>Directeur de la publication :</strong> {LEGAL.directeurPublication}
        </p>
      )}

      <h2>Hébergement</h2>
      <p>Le site est hébergé par :</p>
      <p>
        <strong>{LEGAL.hebergeur.nom}</strong>
        <br />
        {LEGAL.hebergeur.adresse}
        <br />
        {LEGAL.hebergeur.contact}
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments composant le présent site (structure, textes, images, graphismes, logo, code
        source) est la propriété exclusive de l'éditeur, sauf mention contraire, et est protégé par le droit de
        la propriété intellectuelle.
      </p>
      <p>
        Toute reproduction, représentation, modification ou exploitation, totale ou partielle, de ces éléments
        sans autorisation écrite préalable est interdite et constitue une contrefaçon.
      </p>
      <p>
        Les maquettes de démonstration présentées sur ce site peuvent comporter des éléments visuels (logos,
        photographies) appartenant aux entreprises concernées. Ces éléments demeurent la propriété de leurs
        titulaires respectifs et sont utilisés à des fins illustratives. Toute entreprise souhaitant le retrait
        d'une maquette la concernant peut en faire la demande à <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>{" "}
        ; il y sera donné suite dans les meilleurs délais.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        L'éditeur s'efforce d'assurer l'exactitude des informations diffusées sur ce site, sans pouvoir garantir
        qu'elles soient exemptes d'erreur ou d'omission. Les informations sont fournies à titre indicatif et sont
        susceptibles d'évoluer.
      </p>
      <p>
        Le site peut contenir des liens vers des sites tiers sur le contenu desquels l'éditeur n'exerce aucun
        contrôle et dont il ne saurait être tenu responsable.
      </p>

      <h2>Droit applicable</h2>
      <p>Les présentes mentions légales sont soumises au droit français.</p>
    </LegalShell>
  );
}

/* ================================================================== *
 * CONDITIONS GÉNÉRALES DE VENTE (B2B)
 * ================================================================== */
export function Cgv() {
  const acompte = Math.round((LEGAL.prix * LEGAL.acomptePct) / 100);
  return (
    <LegalShell title="Conditions Générales de Vente">
      <h2>Article 1 — Objet et champ d'application</h2>
      <p>
        Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les relations contractuelles
        entre :
      </p>
      <p>
        <strong>
          <Val value={LEGAL.denominationLegale} label="l'éditeur" />
        </strong>
        , {LEGAL.statut}, {!isTodo(LEGAL.siren) && <>immatriculé sous le numéro SIREN {LEGAL.siren}, </>}dont le
        siège est situé <Val value={LEGAL.adresse} label="adresse" />, ci-après « le Prestataire » ;
      </p>
      <p>et toute personne physique ou morale procédant à une commande, ci-après « le Client ».</p>
      <p>
        Les prestations s'adressent exclusivement à des professionnels agissant dans le cadre de leur activité.
        Elles s'appliquent à toutes les prestations de création de sites internet proposées par le Prestataire, à
        l'exclusion de toutes autres conditions, notamment celles du Client.
      </p>
      <p>
        Toute commande implique l'acceptation sans réserve des présentes CGV. Le Client déclare en avoir pris
        connaissance avant validation de sa commande. Le Prestataire se réserve le droit de modifier les
        présentes CGV à tout moment ; les CGV applicables sont celles en vigueur à la date de la commande.
      </p>

      <h2>Article 2 — Prestations proposées</h2>
      <p>Le Prestataire propose la création de sites internet vitrines comprenant :</p>
      <ul>
        <li>{LEGAL.nbPages}</li>
        <li>Conception graphique personnalisée aux couleurs du Client</li>
        <li>Adaptation à tous les écrans (ordinateur, tablette, mobile)</li>
        <li>Formulaire de contact fonctionnel</li>
        <li>Mise en ligne et configuration technique</li>
        <li>Optimisation de base pour les moteurs de recherche</li>
        <li>{LEGAL.revisions} séries de modifications incluses avant livraison finale</li>
      </ul>
      <p>
        <strong>Ne sont pas comprises dans la prestation</strong>, sauf accord écrit distinct : l'acquisition et
        le renouvellement du nom de domaine ; l'hébergement ; la rédaction de contenus rédactionnels longs ; la
        création de logo ou d'identité visuelle complète ; les fonctionnalités de commerce en ligne ; la
        maintenance et les évolutions postérieures à la livraison ; les prestations photographiques.
      </p>
      <p>
        Le périmètre exact de chaque commande est celui décrit sur la page de commande au moment de la
        validation.
      </p>

      <h2>Article 3 — Prix et offre de lancement</h2>
      <p>
        Les prix sont indiqués en euros. Le Prestataire n'est pas assujetti à la TVA :{" "}
        <em>{LEGAL.tvaMention}</em>. Les prix sont donc nets de taxe.
      </p>
      <p>
        <strong>Tarif de lancement :</strong> le Prestataire propose un tarif promotionnel de {LEGAL.prix} €
        applicable aux {LEGAL.quota} premiers clients. Cette offre est limitée en nombre et non reconductible.
        Au-delà de ce quota, le tarif applicable est de {LEGAL.prixApres} €.
      </p>
      <p>
        Le prix applicable est celui affiché sur la page de commande au moment de la validation de celle-ci. Le
        nombre de commandes déjà passées au tarif de lancement est décompté de manière effective par le
        Prestataire. Le Prestataire se réserve le droit de modifier ses tarifs à tout moment ; les commandes déjà
        validées ne sont pas affectées par ces modifications.
      </p>

      <h2>Article 4 — Commande</h2>
      <p>La commande est réputée ferme et définitive lorsque :</p>
      <ol>
        <li>Le Client a rempli le formulaire de commande ;</li>
        <li>Le Client a accepté les présentes CGV en cochant la case prévue à cet effet ;</li>
        <li>Le paiement a été validé par le prestataire de paiement.</li>
      </ol>
      <p>Le Prestataire adresse au Client un e-mail de confirmation récapitulant la commande.</p>
      <p>
        Le Prestataire se réserve le droit de refuser toute commande pour motif légitime, notamment en cas de
        demande manifestement contraire à l'ordre public, aux bonnes mœurs, ou excédant le périmètre de la
        prestation. Dans ce cas, les sommes versées sont intégralement remboursées.
      </p>

      <h2>Article 5 — Modalités de paiement</h2>
      <p>
        Le paiement s'effectue en ligne par carte bancaire via la solution sécurisée Stripe. Le Prestataire n'a
        accès à aucune donnée bancaire du Client.
      </p>
      <p>Deux modalités sont proposées :</p>
      <ul>
        <li>
          <strong>Paiement intégral</strong> à la commande ;
        </li>
        <li>
          <strong>Acompte de {LEGAL.acomptePct} %</strong> ({acompte} €) à la commande, le solde étant exigible à
          la livraison, avant mise en ligne définitive.
        </li>
      </ul>
      <p>
        En cas de retard de paiement entre professionnels, des pénalités de retard sont applicables au taux
        d'intérêt de la Banque centrale européenne majoré de 10 points, ainsi qu'une indemnité forfaitaire pour
        frais de recouvrement de 40 €, conformément aux articles L441-10 et D441-5 du Code de commerce.
      </p>
      <p>Une facture est adressée au Client par voie électronique après paiement.</p>

      <h2>Article 6 — Obligations du Client</h2>
      <p>
        La bonne exécution de la prestation suppose la collaboration active du Client. Celui-ci s'engage à
        fournir, dans un délai de {LEGAL.delaiLivraison} jours suivant la commande : les textes et informations
        relatifs à son activité ; son logo et ses éléments d'identité visuelle, le cas échéant ; les
        photographies qu'il souhaite voir figurer sur le site ; les accès techniques nécessaires (nom de domaine,
        hébergement existant).
      </p>
      <p>
        <strong>Le Client garantit détenir l'ensemble des droits</strong> sur les éléments qu'il transmet
        (textes, images, marques, logos) et garantit le Prestataire contre tout recours de tiers à ce titre. Le
        Client est seul responsable du contenu éditorial de son site et de sa conformité à la réglementation
        applicable à son activité.
      </p>

      <h2>Article 7 — Délais de livraison</h2>
      <p>
        Le délai indicatif de livraison est de <strong>{LEGAL.delaiLivraison} jours ouvrés</strong> à compter de
        la réception de l'intégralité des éléments mentionnés à l'article 6. Ce délai est suspendu en cas de
        retard du Client dans la transmission des éléments, ou dans la validation des maquettes proposées.
      </p>
      <p>
        Les délais sont donnés à titre indicatif. Un retard raisonnable ne peut donner lieu à annulation de la
        commande, à retenue, ni à dommages et intérêts.
      </p>

      <h2>Article 8 — Validation et modifications</h2>
      <p>
        Le Prestataire soumet au Client une maquette du site. Le Client dispose de{" "}
        {LEGAL.delaiValidationMaquette} jours pour formuler ses observations. La prestation comprend{" "}
        <strong>{LEGAL.revisions} séries de modifications</strong>. Toute demande supplémentaire, ou toute demande
        excédant le périmètre initial (ajout de pages, changement complet d'orientation graphique), fait l'objet
        d'un devis complémentaire.
      </p>
      <p>
        À défaut de retour du Client dans le délai de {LEGAL.delaiValidationMaquette} jours, la maquette est
        réputée validée.
      </p>

      <h2>Article 9 — Livraison et mise en ligne</h2>
      <p>La mise en ligne intervient après validation finale du Client et paiement intégral du prix.</p>
      <p>
        Le Prestataire remet au Client le code source du site ainsi que les accès nécessaires à son
        administration.
      </p>

      <h2>Article 10 — Propriété intellectuelle</h2>
      <p>
        <strong>Avant paiement intégral</strong>, le Prestataire demeure titulaire de l'ensemble des droits sur
        les créations réalisées.
      </p>
      <p>
        <strong>Après paiement intégral du prix</strong>, le Prestataire cède au Client les droits d'exploitation
        sur le site livré (droits de reproduction, de représentation et d'adaptation), pour la durée légale de
        protection et pour le monde entier.
      </p>
      <p>Cette cession ne s'étend pas :</p>
      <ul>
        <li>
          aux composants tiers intégrés au site (bibliothèques logicielles, polices de caractères, images sous
          licence), qui demeurent soumis à leurs licences respectives ;
        </li>
        <li>aux méthodes, savoir-faire et éléments réutilisables du Prestataire.</li>
      </ul>
      <p>Le Client conserve l'entière propriété des éléments qu'il a fournis.</p>
      <p>
        Sauf refus exprès du Client, le Prestataire se réserve le droit de mentionner la réalisation dans ses
        références commerciales et d'en présenter des captures d'écran sur ses supports de communication.
      </p>

      <h2>Article 11 — Garanties et responsabilité</h2>
      <p>
        Le Prestataire garantit le bon fonctionnement du site tel que livré pendant une durée de{" "}
        {LEGAL.garantieJours} jours à compter de la mise en ligne. Cette garantie couvre la correction des
        dysfonctionnements techniques imputables au Prestataire.
      </p>
      <p>Sont exclus de la garantie :</p>
      <ul>
        <li>les dysfonctionnements résultant d'une modification effectuée par le Client ou un tiers ;</li>
        <li>les défaillances de l'hébergeur ou du fournisseur de nom de domaine ;</li>
        <li>les évolutions des navigateurs, systèmes d'exploitation ou services tiers ;</li>
        <li>les contenus fournis par le Client.</li>
      </ul>
      <p>
        Le Prestataire est tenu à une <strong>obligation de moyens</strong>. Sa responsabilité ne saurait être
        engagée à raison des dommages indirects (perte de chiffre d'affaires, de clientèle, d'image, de données).
        En tout état de cause, la responsabilité du Prestataire est limitée au montant effectivement payé par le
        Client au titre de la commande concernée.
      </p>
      <p>
        Le Prestataire ne garantit aucun résultat en termes de positionnement dans les moteurs de recherche, de
        trafic ou de chiffre d'affaires.
      </p>

      <h2>Article 12 — Hébergement et nom de domaine</h2>
      <p>
        Sauf mention contraire, l'hébergement et le nom de domaine ne sont pas compris dans le prix de la
        prestation. Le nom de domaine et l'hébergement relèvent de la seule responsabilité du Client, qui les
        souscrit directement auprès des fournisseurs de son choix, en son nom et pour son compte.
      </p>
      <p>
        À la demande du Client, le Prestataire peut procéder à la configuration technique nécessaire à la mise en
        ligne et peut recommander, à titre purement indicatif, des solutions d'hébergement ; sa responsabilité ne
        saurait être engagée à raison du choix, du fonctionnement, de la disponibilité ou de la sécurité de
        l'hébergement retenu. Le code source du site est remis au Client après paiement intégral du prix.
      </p>

      <h2>Article 13 — Annulation</h2>
      <p>
        <strong>Annulation à l'initiative du Client :</strong>
      </p>
      <ul>
        <li>avant tout commencement d'exécution : remboursement intégral des sommes versées ;</li>
        <li>
          après commencement d'exécution : l'acompte versé reste acquis au Prestataire à titre d'indemnisation du
          travail engagé ;
        </li>
        <li>après livraison de la maquette : le prix reste intégralement dû.</li>
      </ul>
      <p>
        <strong>Annulation à l'initiative du Prestataire :</strong> en cas d'impossibilité d'exécuter la
        prestation, notamment en raison d'une carence prolongée du Client dans la transmission des éléments, le
        Prestataire peut résilier la commande après mise en demeure restée sans effet pendant {LEGAL.delaiCarence}{" "}
        jours. Les sommes correspondant au travail non réalisé sont remboursées.
      </p>

      <h2>Article 14 — Protection des données personnelles</h2>
      <p>
        Les données collectées font l'objet d'un traitement décrit dans la{" "}
        <Link href="/confidentialite">Politique de confidentialité</Link> accessible sur le site.
      </p>

      <h2>Article 15 — Force majeure</h2>
      <p>
        Aucune des parties ne pourra être tenue responsable de l'inexécution de ses obligations en cas de force
        majeure au sens de l'article 1218 du Code civil.
      </p>

      <h2>Article 16 — Nullité partielle</h2>
      <p>
        Si une stipulation des présentes CGV était déclarée nulle ou inapplicable, les autres stipulations
        demeureraient pleinement en vigueur.
      </p>

      <h2>Article 17 — Droit applicable et juridiction compétente</h2>
      <p>Les présentes CGV sont soumises au droit français.</p>
      <p>
        En cas de litige entre professionnels, et à défaut de résolution amiable, compétence expresse est
        attribuée aux tribunaux de <Val value={LEGAL.tribunalVille} label="ville du tribunal" />, nonobstant
        pluralité de défendeurs ou appel en garantie.
      </p>

      <p className="text-sm text-muted-foreground">
        CGV en vigueur au {LEGAL.lastUpdated} — version {LEGAL.cgvVersion}.
      </p>
    </LegalShell>
  );
}

/* ================================================================== *
 * POLITIQUE DE CONFIDENTIALITÉ
 * ================================================================== */
export function Confidentialite() {
  return (
    <LegalShell title="Politique de confidentialité">
      <h2>1. Responsable du traitement</h2>
      <p>Le responsable du traitement des données collectées sur ce site est :</p>
      <p>
        <strong>
          <Val value={LEGAL.denominationLegale} label="l'éditeur" />
        </strong>
        , <Val value={LEGAL.adresse} label="adresse" />
        {!isTodo(LEGAL.siren) && <>, SIREN {LEGAL.siren}</>}
        <br />
        Contact : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
      </p>

      <h2>2. Données collectées et finalités</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Données collectées</th>
              <th>Finalité</th>
              <th>Base légale</th>
              <th>Conservation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nom de l'entreprise, nom, e-mail, téléphone, secteur d'activité, site actuel (formulaires)</td>
              <td>Répondre à la demande, établir un devis, envoyer une maquette</td>
              <td>Mesures précontractuelles à la demande de la personne (art. 6.1.b RGPD)</td>
              <td>3 ans à compter du dernier contact</td>
            </tr>
            <tr>
              <td>Données de commande et de facturation</td>
              <td>Exécution du contrat, obligations comptables</td>
              <td>Exécution du contrat (art. 6.1.b) et obligation légale (art. 6.1.c)</td>
              <td>10 ans (obligations comptables)</td>
            </tr>
            <tr>
              <td>Données de navigation (pages vues, source de trafic)</td>
              <td>Mesure d'audience et amélioration du site</td>
              <td>Intérêt légitime, ou consentement selon l'outil utilisé</td>
              <td>13 mois maximum</td>
            </tr>
            <tr>
              <td>Coordonnées professionnelles collectées à des fins de prospection</td>
              <td>Prospection commerciale B2B</td>
              <td>Intérêt légitime (art. 6.1.f)</td>
              <td>3 ans à compter de la collecte ou du dernier contact</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Aucune donnée bancaire n'est collectée ni conservée par l'éditeur.</strong> Les paiements sont
        traités directement par Stripe, qui agit en qualité de responsable de traitement pour ces données.
      </p>

      <h2>3. Origine des données de prospection</h2>
      <p>
        Certaines données de contact professionnelles peuvent être collectées à partir de{" "}
        <strong>sources publiques</strong> : registre national des entreprises (INSEE/SIRENE), sites internet
        professionnels accessibles publiquement, annuaires professionnels.
      </p>
      <p>
        Ces données sont exclusivement des données professionnelles, utilisées à des fins de prospection
        commerciale B2B. Toute personne concernée peut s'opposer à ce traitement à tout moment en écrivant à{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> ; il y sera fait droit sans délai.
      </p>

      <h2>4. Destinataires des données</h2>
      <p>Les données ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales.</p>
      <p>
        Elles peuvent être transmises aux prestataires techniques suivants, agissant en qualité de
        sous-traitants :
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Prestataire</th>
              <th>Rôle</th>
              <th>Localisation des données</th>
            </tr>
          </thead>
          <tbody>
            {LEGAL.sousTraitants.map((s) => (
              <tr key={s.nom}>
                <td>{s.nom}</td>
                <td>{s.role}</td>
                <td>{s.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <strong>Transferts hors Union européenne :</strong> certains prestataires sont établis hors de l'Union
        européenne. Ces transferts sont encadrés par les clauses contractuelles types de la Commission
        européenne et, le cas échéant, par le cadre de protection des données UE–États-Unis (<em>EU–US Data
        Privacy Framework</em>).
      </p>

      <h2>5. Vos droits</h2>
      <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
      <ul>
        <li>
          <strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et en recevoir
          une copie ;
        </li>
        <li>
          <strong>Droit de rectification</strong> : faire corriger des données inexactes ;
        </li>
        <li>
          <strong>Droit à l'effacement</strong> : demander la suppression de vos données, dans les limites des
          obligations légales de conservation ;
        </li>
        <li>
          <strong>Droit à la limitation</strong> du traitement ;
        </li>
        <li>
          <strong>Droit d'opposition</strong>, notamment à la prospection commerciale ;
        </li>
        <li>
          <strong>Droit à la portabilité</strong> de vos données ;
        </li>
        <li>
          <strong>Droit de définir des directives</strong> relatives au sort de vos données après votre décès.
        </li>
      </ul>
      <p>
        Pour exercer ces droits : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>, ou par courrier à{" "}
        <Val value={LEGAL.adresse} label="adresse" />. Une réponse vous sera apportée dans un délai d'un mois. Une
        pièce justificative d'identité peut être demandée en cas de doute raisonnable sur l'identité du demandeur.
      </p>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser
        une réclamation à la <strong>CNIL</strong> — 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 —{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        .
      </p>

      <h2>6. Cookies et traceurs</h2>
      <p>
        Ce site n'utilise que des cookies strictement nécessaires à son fonctionnement et à la sécurisation des
        paiements. Ces cookies ne nécessitent pas votre consentement préalable. Aucun cookie publicitaire ni de
        suivi comportemental n'est déposé.
      </p>
      <p className="text-sm text-muted-foreground">
        Si un outil de mesure d'audience non exempté ou un traceur marketing venait à être ajouté, un bandeau de
        consentement (avec refus aussi simple que l'acceptation) serait mis en place et cette section mise à jour.
      </p>

      <h2>7. Sécurité</h2>
      <p>
        L'éditeur met en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données
        : chiffrement des communications (HTTPS), accès restreints, prestataires sélectionnés pour leurs
        garanties de sécurité.
      </p>

      <h2>8. Modification de la présente politique</h2>
      <p>
        La présente politique peut être modifiée pour tenir compte des évolutions légales ou techniques. La
        version applicable est celle publiée sur le site.
      </p>
    </LegalShell>
  );
}
