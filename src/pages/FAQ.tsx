import KrakkenSidebar from "@/components/dashboard/KrakkenSidebar";
import { motion } from "framer-motion";
import { HelpCircle, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqSections: {
  category: string;
  items: { q: string; a: string }[];
}[] = [
  {
    category: "Démarrer avec Krakken",
    items: [
      {
        q: "Qu'est-ce que Krakken exactement ?",
        a: "Krakken est un outil de sourcing dédié au marché français. On scanne en continu Cdiscount pour détecter les produits qui vendent vraiment (via les récurrences d'avis), on enrichit chaque fiche avec prix, marque et stock, puis on te donne les liens directs pour sourcer sur AliExpress ou via Google Lens.",
      },
      {
        q: "À qui s'adresse l'outil ?",
        a: "Aux e-commerçants, dropshippers et revendeurs Amazon/Cdiscount qui veulent gagner du temps sur la phase de recherche produit et travailler uniquement sur des références déjà validées par le marché.",
      },
      {
        q: "Comment fonctionne l'essai gratuit ?",
        a: "Tu as 14 jours d'accès complet à toutes les fonctionnalités, sans carte bancaire requise à l'inscription. À la fin de l'essai, tu peux passer au plan Pro (9,90€/mois) pour conserver l'accès.",
      },
    ],
  },
  {
    category: "Données & produits",
    items: [
      {
        q: "Comment sont détectés les produits qui vendent ?",
        a: "On surveille la vélocité des avis Cdiscount. Quand un produit accumule de nouveaux avis sur une courte période, c'est le signal qu'il génère des ventes récurrentes. C'est l'indicateur 'Récurrences' que tu vois sur chaque fiche.",
      },
      {
        q: "À quelle fréquence les données sont-elles mises à jour ?",
        a: "Les produits sont rescannés quotidiennement. La colonne 'Dernier vu' t'indique la fraîcheur de chaque information.",
      },
      {
        q: "Que veut dire 'Meilleure prise' sur le dashboard ?",
        a: "C'est le pourcentage de réduction le plus élevé détecté sur tes produits suivis. Un signal utile pour repérer des opportunités de marge.",
      },
    ],
  },
  {
    category: "Favoris & calculateur",
    items: [
      {
        q: "Comment organiser mes favoris ?",
        a: "Chaque produit sauvegardé peut être rangé dans 4 collections : À sourcer, Test, Validé, Abandonné. Ça te permet de suivre l'avancée de ton sourcing sans sortir de l'app.",
      },
      {
        q: "Le calculateur de marge gère-t-il toutes les marketplaces ?",
        a: "Oui, on couvre Amazon FR, Cdiscount, Fnac, ManoMano, Rakuten et la vente directe. Les commissions et frais fixes sont préchargés et mis à jour régulièrement.",
      },
      {
        q: "La TVA est-elle incluse dans les calculs ?",
        a: "Oui, tu peux activer ou désactiver la TVA (20% par défaut). Le calcul te donne ta marge nette HT après commission marketplace, frais fixes et frais d'expédition.",
      },
    ],
  },
  {
    category: "Abonnement & facturation",
    items: [
      {
        q: "Combien coûte le plan Pro ?",
        a: "9,90€ par mois, sans engagement. Tu peux résilier à tout moment depuis la page Abonnement.",
      },
      {
        q: "Comment annuler mon abonnement ?",
        a: "Va dans Abonnement → Gérer mon abonnement. Tu seras redirigé vers le portail sécurisé Stripe pour annuler ou modifier ta carte. L'accès reste actif jusqu'à la fin de la période payée.",
      },
      {
        q: "Que se passe-t-il si mon paiement échoue ?",
        a: "Tu reçois un email automatique et l'accès est suspendu jusqu'à régularisation. Stripe retente le prélèvement plusieurs fois avant suspension définitive.",
      },
    ],
  },
  {
    category: "Compte & sécurité",
    items: [
      {
        q: "Comment changer mon mot de passe ?",
        a: "Déconnecte-toi, puis utilise 'Mot de passe oublié' sur la page de connexion. Tu recevras un lien sécurisé pour en définir un nouveau.",
      },
      {
        q: "Mes données sont-elles en sécurité ?",
        a: "Toutes les données sont hébergées en Europe sur une infrastructure conforme RGPD. Aucune donnée n'est revendue à des tiers. Tu peux demander la suppression de ton compte à tout moment.",
      },
      {
        q: "Puis-je utiliser Krakken à plusieurs ?",
        a: "Pour le moment, un compte = un utilisateur. Si tu as besoin d'un accès équipe, contacte-nous directement.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex" style={{ background: "hsl(230 50% 3%)" }}>
      <KrakkenSidebar />
      <main className="flex-1 ml-16 xl:ml-56 px-6 lg:px-12 py-10 lg:py-14 max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, hsl(228 42% 7%), hsl(225 35% 5%))",
                border: "1px solid hsl(174 72% 46% / 0.25)",
                boxShadow: "0 0 24px -6px hsl(174 72% 46% / 0.3)",
              }}
            >
              <HelpCircle
                className="w-5 h-5 text-primary"
                style={{ filter: "drop-shadow(0 0 4px hsl(174 72% 46% / 0.5))" }}
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
              Centre d'aide
            </p>
          </div>
          <h1
            className="kraken-title text-foreground"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", lineHeight: 1.05 }}
          >
            Questions fréquentes
          </h1>
          <p className="mt-4 text-muted-foreground text-base lg:text-lg max-w-2xl">
            Tout ce qu'il faut savoir pour exploiter Krakken au maximum. Une question hors liste ?
            Écris-nous, on répond vite.
          </p>
        </motion.header>

        <div className="space-y-12">
          {faqSections.map((section, sIdx) => (
            <motion.section
              key={section.category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sIdx * 0.05 }}
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary/90 mb-4">
                {section.category}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, hsl(228 38% 7% / 0.7), hsl(225 32% 6% / 0.5))",
                  border: "1px solid hsl(225 30% 14% / 0.6)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {section.items.map((item, idx) => (
                  <AccordionItem
                    key={item.q}
                    value={`${sIdx}-${idx}`}
                    className="border-b border-sidebar-border/40 last:border-b-0 px-5"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-primary transition-colors text-[15px] font-semibold py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-[14px] leading-relaxed pb-5 pr-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 p-6 lg:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between"
          style={{
            background:
              "linear-gradient(135deg, hsl(174 72% 46% / 0.08), hsl(262 52% 58% / 0.06))",
            border: "1px solid hsl(174 72% 46% / 0.2)",
            boxShadow: "0 0 30px -10px hsl(174 72% 46% / 0.2)",
          }}
        >
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Besoin d'un coup de main ?</h3>
            <p className="text-sm text-muted-foreground">
              On répond à toutes les questions sous 24h en semaine.
            </p>
          </div>
          <a
            href="mailto:support@krakken.io"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, hsl(174 72% 46%), hsl(174 72% 38%))",
              color: "hsl(228 42% 7%)",
              boxShadow: "0 0 20px -4px hsl(174 72% 46% / 0.5)",
            }}
          >
            <Mail className="w-4 h-4" />
            support@krakken.io
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default FAQ;
