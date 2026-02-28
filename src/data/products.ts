export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  sales: number;
  rating: number;
  score: number;
  trend: "up" | "down" | "stable";
  velocity: string;
}

export const categories = [
  "Tous", "Smartphones", "Informatique", "TV & Son", "Électroménager", 
  "Gaming", "Maison", "Jouets", "Sport", "Mode", "Beauté", "Auto"
];

export const brands = [
  "Toutes", "Samsung", "Apple", "Dyson", "Sony", "LG", "Xiaomi", "Philips", 
  "Bosch", "Nintendo", "LEGO", "Nike", "Ninja", "iRobot", "Bose", "HP"
];

export const products: Product[] = [
  { id: 1, name: "Galaxy S24 Ultra 256Go", brand: "Samsung", category: "Smartphones", price: 899, originalPrice: 1159, sales: 12847, rating: 4.7, score: 98, trend: "up", velocity: "+++" },
  { id: 2, name: "Dyson V15 Detect Absolute", brand: "Dyson", category: "Électroménager", price: 549, originalPrice: 699, sales: 9234, rating: 4.8, score: 96, trend: "up", velocity: "++" },
  { id: 3, name: "PlayStation 5 Slim", brand: "Sony", category: "Gaming", price: 399, originalPrice: 449, sales: 8102, rating: 4.6, score: 94, trend: "up", velocity: "++" },
  { id: 4, name: "AirPods Pro 2 USB-C", brand: "Apple", category: "TV & Son", price: 229, originalPrice: 279, sales: 7891, rating: 4.7, score: 93, trend: "up", velocity: "++" },
  { id: 5, name: "Foodi MAX 9-en-1", brand: "Ninja", category: "Électroménager", price: 179, originalPrice: 249, sales: 6543, rating: 4.5, score: 91, trend: "stable", velocity: "+" },
  { id: 6, name: "OLED C4 55\"", brand: "LG", category: "TV & Son", price: 1099, originalPrice: 1499, sales: 5890, rating: 4.8, score: 90, trend: "up", velocity: "++" },
  { id: 7, name: "Technic Ferrari Daytona SP3", brand: "LEGO", category: "Jouets", price: 349, originalPrice: 449, sales: 5210, rating: 4.9, score: 89, trend: "up", velocity: "+" },
  { id: 8, name: "Roomba j7+ Combo", brand: "iRobot", category: "Électroménager", price: 599, originalPrice: 899, sales: 4890, rating: 4.4, score: 87, trend: "down", velocity: "~" },
  { id: 9, name: "iPhone 15 128Go", brand: "Apple", category: "Smartphones", price: 799, originalPrice: 969, sales: 4650, rating: 4.6, score: 86, trend: "stable", velocity: "+" },
  { id: 10, name: "Switch OLED", brand: "Nintendo", category: "Gaming", price: 299, originalPrice: 349, sales: 4320, rating: 4.7, score: 85, trend: "stable", velocity: "+" },
  { id: 11, name: "QuietComfort Ultra", brand: "Bose", category: "TV & Son", price: 329, originalPrice: 449, sales: 4100, rating: 4.6, score: 84, trend: "up", velocity: "++" },
  { id: 12, name: "Redmi Note 13 Pro", brand: "Xiaomi", category: "Smartphones", price: 249, originalPrice: 349, sales: 3980, rating: 4.3, score: 83, trend: "up", velocity: "++" },
  { id: 13, name: "Air Fryer XXL", brand: "Philips", category: "Électroménager", price: 129, originalPrice: 199, sales: 3870, rating: 4.5, score: 82, trend: "up", velocity: "+" },
  { id: 14, name: "Victus 16\" RTX 4060", brand: "HP", category: "Informatique", price: 849, originalPrice: 1099, sales: 3650, rating: 4.4, score: 81, trend: "up", velocity: "+" },
  { id: 15, name: "Série 4 Lave-Linge 9kg", brand: "Bosch", category: "Électroménager", price: 449, originalPrice: 599, sales: 3520, rating: 4.5, score: 80, trend: "stable", velocity: "+" },
  { id: 16, name: "Air Force 1 '07", brand: "Nike", category: "Mode", price: 89, originalPrice: 119, sales: 3410, rating: 4.6, score: 79, trend: "stable", velocity: "+" },
  { id: 17, name: "Galaxy Tab S9 FE", brand: "Samsung", category: "Informatique", price: 349, originalPrice: 459, sales: 3200, rating: 4.4, score: 78, trend: "up", velocity: "+" },
  { id: 18, name: "WH-1000XM5", brand: "Sony", category: "TV & Son", price: 279, originalPrice: 399, sales: 3100, rating: 4.7, score: 77, trend: "down", velocity: "~" },
  { id: 19, name: "Pad 6 256Go", brand: "Xiaomi", category: "Informatique", price: 299, originalPrice: 399, sales: 2890, rating: 4.3, score: 76, trend: "up", velocity: "+" },
  { id: 20, name: "Duplo Train à Vapeur", brand: "LEGO", category: "Jouets", price: 49, originalPrice: 64, sales: 2780, rating: 4.8, score: 75, trend: "stable", velocity: "+" },
  { id: 21, name: "XPS 15 OLED", brand: "HP", category: "Informatique", price: 1499, originalPrice: 1899, sales: 2650, rating: 4.5, score: 74, trend: "up", velocity: "+" },
  { id: 22, name: "Galaxy Watch 6", brand: "Samsung", category: "Mode", price: 249, originalPrice: 319, sales: 2540, rating: 4.3, score: 73, trend: "down", velocity: "~" },
  { id: 23, name: "DualSense Edge", brand: "Sony", category: "Gaming", price: 189, originalPrice: 239, sales: 2430, rating: 4.2, score: 72, trend: "stable", velocity: "+" },
  { id: 24, name: "Pure Cool TP07", brand: "Dyson", category: "Maison", price: 449, originalPrice: 599, sales: 2310, rating: 4.6, score: 71, trend: "up", velocity: "+" },
  { id: 25, name: "Sonicare 9900", brand: "Philips", category: "Beauté", price: 199, originalPrice: 299, sales: 2200, rating: 4.4, score: 70, trend: "stable", velocity: "+" },
];
