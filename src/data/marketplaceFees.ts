// Grilles de commissions marketplaces (taux indicatifs 2025).
// Sources : pages publiques des marketplaces + référentiel marketplace-mastery.
// Toutes les commissions s'appliquent au prix de vente TTC sauf mention contraire.

export type MarketplaceId =
  | "cdiscount"
  | "amazon"
  | "fnac"
  | "rakuten"
  | "manomano"
  | "rueducommerce"
  | "vinted"
  | "autre";

export interface CategoryFee {
  id: string;
  label: string;
  /** Taux de commission appliqué au prix de vente TTC (0.15 = 15%) */
  rate: number;
}

export interface Marketplace {
  id: MarketplaceId;
  label: string;
  /** Frais fixes par transaction (€) */
  fixedFee: number;
  /** Abonnement mensuel indicatif (€) */
  monthlyFee: number;
  categories: CategoryFee[];
}

export const MARKETPLACES: Marketplace[] = [
  {
    id: "cdiscount",
    label: "Cdiscount",
    fixedFee: 0.3,
    monthlyFee: 39.99,
    categories: [
      { id: "high_tech", label: "High-Tech", rate: 0.12 },
      { id: "maison", label: "Maison & Déco", rate: 0.15 },
      { id: "electromenager", label: "Électroménager", rate: 0.11 },
      { id: "mode", label: "Mode", rate: 0.16 },
      { id: "jardin", label: "Jardin & Bricolage", rate: 0.13 },
      { id: "puericulture", label: "Puériculture", rate: 0.14 },
      { id: "auto", label: "Auto-Moto", rate: 0.1 },
      { id: "sport", label: "Sport & Loisirs", rate: 0.14 },
      { id: "autre", label: "Autre", rate: 0.15 },
    ],
  },
  {
    id: "amazon",
    label: "Amazon",
    fixedFee: 0,
    monthlyFee: 39,
    categories: [
      { id: "high_tech", label: "Informatique / High-Tech", rate: 0.07 },
      { id: "electronique", label: "Électronique grand public", rate: 0.08 },
      { id: "maison", label: "Maison & Cuisine", rate: 0.15 },
      { id: "mode", label: "Mode & Accessoires", rate: 0.15 },
      { id: "beaute", label: "Beauté & Soin", rate: 0.15 },
      { id: "jouets", label: "Jouets & Jeux", rate: 0.15 },
      { id: "sport", label: "Sports & Plein air", rate: 0.15 },
      { id: "auto", label: "Auto & Moto", rate: 0.12 },
      { id: "livres", label: "Livres", rate: 0.15 },
      { id: "autre", label: "Autre", rate: 0.15 },
    ],
  },
  {
    id: "fnac",
    label: "Fnac / Darty",
    fixedFee: 0.4,
    monthlyFee: 39.99,
    categories: [
      { id: "high_tech", label: "High-Tech", rate: 0.08 },
      { id: "electromenager", label: "Électroménager", rate: 0.1 },
      { id: "maison", label: "Maison", rate: 0.14 },
      { id: "mode", label: "Mode", rate: 0.16 },
      { id: "livres", label: "Livres", rate: 0.16 },
      { id: "jouets", label: "Jeux & Jouets", rate: 0.14 },
      { id: "autre", label: "Autre", rate: 0.13 },
    ],
  },
  {
    id: "rakuten",
    label: "Rakuten",
    fixedFee: 0.3,
    monthlyFee: 39,
    categories: [
      { id: "high_tech", label: "High-Tech", rate: 0.08 },
      { id: "maison", label: "Maison & Jardin", rate: 0.12 },
      { id: "mode", label: "Mode", rate: 0.14 },
      { id: "auto", label: "Auto-Moto", rate: 0.09 },
      { id: "loisirs", label: "Loisirs & Culture", rate: 0.12 },
      { id: "autre", label: "Autre", rate: 0.12 },
    ],
  },
  {
    id: "manomano",
    label: "ManoMano",
    fixedFee: 0,
    monthlyFee: 0,
    categories: [
      { id: "bricolage", label: "Bricolage", rate: 0.15 },
      { id: "jardin", label: "Jardin", rate: 0.15 },
      { id: "maison", label: "Maison", rate: 0.16 },
      { id: "outillage", label: "Outillage", rate: 0.13 },
      { id: "autre", label: "Autre", rate: 0.15 },
    ],
  },
  {
    id: "rueducommerce",
    label: "Rue du Commerce",
    fixedFee: 0.3,
    monthlyFee: 39,
    categories: [
      { id: "high_tech", label: "High-Tech", rate: 0.1 },
      { id: "maison", label: "Maison", rate: 0.13 },
      { id: "mode", label: "Mode", rate: 0.15 },
      { id: "autre", label: "Autre", rate: 0.12 },
    ],
  },
  {
    id: "vinted",
    label: "Vinted (Pro)",
    fixedFee: 0,
    monthlyFee: 0,
    categories: [
      { id: "mode", label: "Mode", rate: 0.05 },
      { id: "autre", label: "Autre", rate: 0.05 },
    ],
  },
  {
    id: "autre",
    label: "Autre / Personnalisée",
    fixedFee: 0,
    monthlyFee: 0,
    categories: [{ id: "autre", label: "Personnalisée", rate: 0.12 }],
  },
];

export const getMarketplace = (id: MarketplaceId): Marketplace =>
  MARKETPLACES.find((m) => m.id === id) ?? MARKETPLACES[0];

export const getCategory = (mp: Marketplace, categoryId: string): CategoryFee =>
  mp.categories.find((c) => c.id === categoryId) ?? mp.categories[0];
