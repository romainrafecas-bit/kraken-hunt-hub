import LegalLayout from "@/components/legal/LegalLayout";

const MentionsLegales = () => (
  <LegalLayout title="Mentions légales" updated="21/04/2026">
    <h2>Éditeur du site</h2>
    <p>
      <strong>[À COMPLÉTER — Nom ou raison sociale]</strong>
      <br />
      <strong>[À COMPLÉTER — Statut juridique (auto-entrepreneur, SARL, etc.)]</strong>
      <br />
      <strong>[À COMPLÉTER — Adresse complète]</strong>
      <br />
      SIREN/SIRET : <strong>[À COMPLÉTER]</strong>
      <br />
      Numéro de TVA intracommunautaire : <strong>[À COMPLÉTER si applicable]</strong>
      <br />
      Email : <a href="mailto:contact@krakken.io">contact@krakken.io</a>
    </p>

    <h2>Directeur de la publication</h2>
    <p><strong>[À COMPLÉTER — Nom du responsable]</strong></p>

    <h2>Hébergement</h2>
    <p>
      Le site est hébergé via <strong>Lovable Cloud</strong> (infrastructure Supabase).
      <br />
      Site : <a href="https://lovable.dev" target="_blank" rel="noreferrer">lovable.dev</a>
    </p>

    <h2>Propriété intellectuelle</h2>
    <p>
      L'ensemble du contenu présent sur Krakken (textes, graphismes, logos, code, données
      structurées) est protégé par le droit d'auteur et reste la propriété exclusive de
      l'Éditeur, sauf mention contraire. Toute reproduction ou exploitation non autorisée est
      interdite.
    </p>

    <h2>Données et marketplaces</h2>
    <p>
      Les informations produits affichées proviennent de marketplaces tierces et sont fournies à
      titre informatif. Les marques et noms de produits cités appartiennent à leurs propriétaires
      respectifs.
    </p>

    <h2>Contact</h2>
    <p>
      Pour toute question : <a href="mailto:contact@krakken.io">contact@krakken.io</a>
    </p>
  </LegalLayout>
);

export default MentionsLegales;
