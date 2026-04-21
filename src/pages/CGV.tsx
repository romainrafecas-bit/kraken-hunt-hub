import LegalLayout from "@/components/legal/LegalLayout";

const CGV = () => (
  <LegalLayout title="Conditions Générales de Vente" updated="21/04/2026">
    <p>
      Les présentes Conditions Générales de Vente (« CGV ») régissent l'accès et l'utilisation du
      service Krakken, un outil de veille produit en ligne, fourni par <strong>[À COMPLÉTER — Nom de l'éditeur]</strong> (ci-après « l'Éditeur »).
    </p>

    <h2>1. Service</h2>
    <p>
      Krakken est un service en ligne (SaaS) accessible sur abonnement. Il permet de consulter une
      base de données de produits commerciaux, des outils d'analyse et de calcul de marge, et la
      gestion d'une sélection personnelle.
    </p>

    <h2>2. Inscription et accès</h2>
    <p>
      L'accès au service nécessite la création d'un compte. L'inscription est réservée aux
      personnes ayant rejoint la formation associée via systeme.io. Le client garantit l'exactitude
      des informations fournies et s'engage à conserver ses identifiants confidentiels.
    </p>

    <h2>3. Tarifs et modalités de paiement</h2>
    <ul>
      <li><strong>Essai gratuit</strong> : 14 jours, sans carte bancaire requise au départ.</li>
      <li><strong>Abonnement Krakken Pro</strong> : 9,90 € TTC par mois, sans engagement.</li>
      <li>Les paiements sont traités par Stripe, prestataire de paiement sécurisé. L'Éditeur ne stocke aucune donnée bancaire.</li>
      <li>Le prélèvement est automatique et reconduit chaque mois jusqu'à résiliation.</li>
    </ul>

    <h2>4. Durée et résiliation</h2>
    <p>
      L'abonnement est conclu pour une durée mensuelle, renouvelable par tacite reconduction. Le
      client peut résilier à tout moment depuis l'espace « Abonnement » de son compte. La
      résiliation prend effet à la fin de la période en cours déjà payée. Aucun remboursement
      prorata n'est effectué.
    </p>

    <h2>5. Droit de rétractation</h2>
    <p>
      Conformément à l'article L221-28 du Code de la consommation, le client est informé que le
      service constitue la fourniture d'un contenu numérique non fourni sur support matériel dont
      l'exécution a commencé après accord exprès du client (activation immédiate du compte). Le
      client renonce expressément à son droit de rétractation dès l'activation du service.
    </p>

    <h2>6. Obligations du client</h2>
    <p>Le client s'engage à :</p>
    <ul>
      <li>utiliser le service conformément à sa destination ;</li>
      <li>ne pas extraire de manière automatisée et massive le contenu de la base de données ;</li>
      <li>ne pas partager ses identifiants ni revendre l'accès ;</li>
      <li>respecter les lois en vigueur et les droits des tiers.</li>
    </ul>

    <h2>7. Disponibilité et garanties</h2>
    <p>
      L'Éditeur s'engage à fournir un service avec une disponibilité raisonnable, sans garantie
      contractuelle de continuité. Des interruptions pour maintenance peuvent survenir. Les
      informations issues de tiers (marketplaces) sont fournies « en l'état », sans garantie
      d'exactitude ou d'exhaustivité.
    </p>

    <h2>8. Responsabilité</h2>
    <p>
      Krakken est un outil d'aide à la décision. L'Éditeur ne saurait être tenu responsable des
      résultats commerciaux obtenus par le client à partir des informations fournies. La
      responsabilité de l'Éditeur est, en tout état de cause, limitée au montant des sommes
      effectivement perçues du client au cours des douze derniers mois.
    </p>

    <h2>9. Données personnelles</h2>
    <p>
      Le traitement des données personnelles est détaillé dans la <a href="/confidentialite">Politique de confidentialité</a>.
    </p>

    <h2>10. Loi applicable et litiges</h2>
    <p>
      Les présentes CGV sont régies par le droit français. En cas de litige, une solution amiable
      sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls
      compétents.
    </p>

    <h2>11. Contact</h2>
    <p>
      Pour toute question relative aux présentes CGV : <a href="mailto:contact@krakken.io">contact@krakken.io</a>.
    </p>
  </LegalLayout>
);

export default CGV;
