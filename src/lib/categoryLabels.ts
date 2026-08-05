const CATEGORY_LABELS: Record<string, string> = {
  animalerie: "Animalerie",
  "arts-loisirs": "Arts & loisirs",
  auto: "Auto",
  bagages: "Bagages",
  bijouterie: "Bijouterie",
  bricolage: "Bricolage",
  electromenager: "Électroménager",
  "high-tech": "High-tech",
  informatique: "Informatique",
  jardin: "Jardin",
  "jeux-pc-video-console": "Jeux vidéo",
  juniors: "Enfants",
  "le-sport": "Sport",
  maison: "Maison",
  "musique-instruments": "Musique",
  "photo-numerique": "Photo",
  "pret-a-porter": "Mode",
  "sante-mieux-vivre": "Santé & beauté",
  telephonie: "Téléphonie",
};

export function getCategoryLabel(category: string) {
  const normalized = category.trim().toLowerCase();
  return CATEGORY_LABELS[normalized] ?? category.replaceAll("-", " ").replace(/^./, (letter) => letter.toUpperCase());
}