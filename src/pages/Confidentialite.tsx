import LegalLayout from "@/components/legal/LegalLayout";

const Confidentialite = () => (
  <LegalLayout title="Politique de confidentialité" updated="21/04/2026">
    <p>
      La présente politique décrit la manière dont Krakken collecte, utilise et protège vos
      données personnelles, conformément au Règlement Général sur la Protection des Données
      (RGPD) et à la loi Informatique et Libertés.
    </p>

    <h2>1. Responsable de traitement</h2>
    <p>
      <strong>[À COMPLÉTER — Nom, raison sociale, adresse de l'éditeur]</strong>
      <br />
      Contact : <a href="mailto:contact@krakken.io">contact@krakken.io</a>
    </p>

    <h2>2. Données collectées</h2>
    <ul>
      <li><strong>Compte</strong> : adresse email, mot de passe (haché), identifiant utilisateur.</li>
      <li><strong>Profil</strong> : nom d'affichage, avatar (si renseignés).</li>
      <li><strong>Usage</strong> : favoris, calculs de marge enregistrés.</li>
      <li><strong>Paiement</strong> : identifiants Stripe (client, abonnement). Aucune donnée bancaire n'est stockée par l'Éditeur.</li>
      <li><strong>Techniques</strong> : adresse IP, logs de connexion (durée limitée), pour des raisons de sécurité.</li>
    </ul>

    <h2>3. Finalités et bases légales</h2>
    <ul>
      <li><strong>Fourniture du service</strong> (exécution du contrat) : création de compte, authentification, sauvegarde des favoris et calculs.</li>
      <li><strong>Facturation et paiement</strong> (exécution du contrat) : gestion de l'abonnement via Stripe.</li>
      <li><strong>Sécurité</strong> (intérêt légitime) : prévention des fraudes et accès non autorisés.</li>
      <li><strong>Communication transactionnelle</strong> (exécution du contrat) : confirmation, alertes liées au compte.</li>
    </ul>

    <h2>4. Destinataires</h2>
    <p>Vos données sont accessibles uniquement par :</p>
    <ul>
      <li>l'Éditeur et ses prestataires techniques nécessaires au fonctionnement du service ;</li>
      <li><strong>Stripe</strong> (paiement) — données de facturation ;</li>
      <li><strong>Lovable Cloud / Supabase</strong> (hébergement) — données du compte ;</li>
      <li><strong>systeme.io</strong> (vérification de l'éligibilité à l'inscription) — adresse email.</li>
    </ul>
    <p>Aucune donnée n'est revendue à des tiers.</p>

    <h2>5. Durées de conservation</h2>
    <ul>
      <li>Données du compte : tant que le compte est actif, puis 1 an après la dernière activité.</li>
      <li>Données de facturation : 10 ans (obligation comptable).</li>
      <li>Logs techniques : 12 mois maximum.</li>
    </ul>

    <h2>6. Vos droits</h2>
    <p>
      Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement,
      limitation, portabilité, opposition. Pour les exercer, contactez-nous à
      <a href="mailto:contact@krakken.io"> contact@krakken.io</a>. Vous pouvez également introduire
      une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">CNIL</a>.
    </p>

    <h2>7. Cookies et stockage local</h2>
    <p>
      Krakken utilise du stockage local (localStorage) pour maintenir votre session. Aucun cookie
      publicitaire ou de tracking tiers n'est déposé.
    </p>

    <h2>8. Sécurité</h2>
    <p>
      Vos données sont stockées sur une infrastructure sécurisée (Lovable Cloud / Supabase) avec
      chiffrement en transit (HTTPS) et au repos. L'accès aux données est restreint par des
      politiques RLS (Row-Level Security) au niveau base de données.
    </p>

    <h2>9. Modifications</h2>
    <p>
      La présente politique peut être mise à jour. La date en haut de page indique la dernière
      version en vigueur.
    </p>
  </LegalLayout>
);

export default Confidentialite;
