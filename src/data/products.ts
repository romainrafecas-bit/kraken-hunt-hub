export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  recurrences: number;
  lastSeen: string;
  rating: number;
  score: number;
  sellers: number;
  image: string;
  url?: string;
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
  { id: 1, name: "Galaxy S24 Ultra 256Go", brand: "Samsung", category: "Smartphones", price: 899, originalPrice: 1159, recurrences: 12847, lastSeen: "Il y a 2h", rating: 4.7, score: 98, sellers: 24, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop" },
  { id: 2, name: "Dyson V15 Detect Absolute", brand: "Dyson", category: "Électroménager", price: 549, originalPrice: 699, recurrences: 9234, lastSeen: "Il y a 1h", rating: 4.8, score: 96, sellers: 18, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=80&h=80&fit=crop" },
  { id: 3, name: "PlayStation 5 Slim", brand: "Sony", category: "Gaming", price: 399, originalPrice: 449, recurrences: 8102, lastSeen: "Il y a 4h", rating: 4.6, score: 94, sellers: 31, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=80&h=80&fit=crop" },
  { id: 4, name: "AirPods Pro 2 USB-C", brand: "Apple", category: "TV & Son", price: 229, originalPrice: 279, recurrences: 7891, lastSeen: "Il y a 30min", rating: 4.7, score: 93, sellers: 22, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&h=80&fit=crop" },
  { id: 5, name: "Foodi MAX 9-en-1", brand: "Ninja", category: "Électroménager", price: 179, originalPrice: 249, recurrences: 6543, lastSeen: "Il y a 6h", rating: 4.5, score: 91, sellers: 12, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=80&h=80&fit=crop" },
  { id: 6, name: "OLED C4 55\"", brand: "LG", category: "TV & Son", price: 1099, originalPrice: 1499, recurrences: 5890, lastSeen: "Il y a 3h", rating: 4.8, score: 90, sellers: 15, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=80&h=80&fit=crop" },
  { id: 7, name: "Technic Ferrari Daytona SP3", brand: "LEGO", category: "Jouets", price: 349, originalPrice: 449, recurrences: 5210, lastSeen: "Il y a 1j", rating: 4.9, score: 89, sellers: 9, image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=80&h=80&fit=crop" },
  { id: 8, name: "Roomba j7+ Combo", brand: "iRobot", category: "Électroménager", price: 599, originalPrice: 899, recurrences: 4890, lastSeen: "Il y a 5h", rating: 4.4, score: 87, sellers: 14, image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=80&h=80&fit=crop" },
  { id: 9, name: "iPhone 15 128Go", brand: "Apple", category: "Smartphones", price: 799, originalPrice: 969, recurrences: 4650, lastSeen: "Il y a 45min", rating: 4.6, score: 86, sellers: 27, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&h=80&fit=crop" },
  { id: 10, name: "Switch OLED", brand: "Nintendo", category: "Gaming", price: 299, originalPrice: 349, recurrences: 4320, lastSeen: "Il y a 8h", rating: 4.7, score: 85, sellers: 19, image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=80&h=80&fit=crop" },
  { id: 11, name: "QuietComfort Ultra", brand: "Bose", category: "TV & Son", price: 329, originalPrice: 449, recurrences: 4100, lastSeen: "Il y a 2h", rating: 4.6, score: 84, sellers: 16, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop" },
  { id: 12, name: "Redmi Note 13 Pro", brand: "Xiaomi", category: "Smartphones", price: 249, originalPrice: 349, recurrences: 3980, lastSeen: "Il y a 12h", rating: 4.3, score: 83, sellers: 21, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=80&h=80&fit=crop" },
  { id: 13, name: "Air Fryer XXL", brand: "Philips", category: "Électroménager", price: 129, originalPrice: 199, recurrences: 3870, lastSeen: "Il y a 1j", rating: 4.5, score: 82, sellers: 11, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=80&h=80&fit=crop" },
  { id: 14, name: "Victus 16\" RTX 4060", brand: "HP", category: "Informatique", price: 849, originalPrice: 1099, recurrences: 3650, lastSeen: "Il y a 3h", rating: 4.4, score: 81, sellers: 13, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&h=80&fit=crop" },
  { id: 15, name: "Série 4 Lave-Linge 9kg", brand: "Bosch", category: "Électroménager", price: 449, originalPrice: 599, recurrences: 3520, lastSeen: "Il y a 2j", rating: 4.5, score: 80, sellers: 8, image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=80&h=80&fit=crop" },
  { id: 16, name: "Air Force 1 '07", brand: "Nike", category: "Mode", price: 89, originalPrice: 119, recurrences: 3410, lastSeen: "Il y a 7h", rating: 4.6, score: 79, sellers: 35, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop" },
  { id: 17, name: "Galaxy Tab S9 FE", brand: "Samsung", category: "Informatique", price: 349, originalPrice: 459, recurrences: 3200, lastSeen: "Il y a 4h", rating: 4.4, score: 78, sellers: 17, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&h=80&fit=crop" },
  { id: 18, name: "WH-1000XM5", brand: "Sony", category: "TV & Son", price: 279, originalPrice: 399, recurrences: 3100, lastSeen: "Il y a 1h", rating: 4.7, score: 77, sellers: 20, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=80&h=80&fit=crop" },
  { id: 19, name: "Pad 6 256Go", brand: "Xiaomi", category: "Informatique", price: 299, originalPrice: 399, recurrences: 2890, lastSeen: "Il y a 6h", rating: 4.3, score: 76, sellers: 14, image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=80&h=80&fit=crop" },
  { id: 20, name: "Duplo Train à Vapeur", brand: "LEGO", category: "Jouets", price: 49, originalPrice: 64, recurrences: 2780, lastSeen: "Il y a 3j", rating: 4.8, score: 75, sellers: 7, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=80&h=80&fit=crop" },
  { id: 21, name: "XPS 15 OLED", brand: "HP", category: "Informatique", price: 1499, originalPrice: 1899, recurrences: 2650, lastSeen: "Il y a 5h", rating: 4.5, score: 74, sellers: 10, image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=80&h=80&fit=crop" },
  { id: 22, name: "Galaxy Watch 6", brand: "Samsung", category: "Mode", price: 249, originalPrice: 319, recurrences: 2540, lastSeen: "Il y a 10h", rating: 4.3, score: 73, sellers: 16, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=80&h=80&fit=crop" },
  { id: 23, name: "DualSense Edge", brand: "Sony", category: "Gaming", price: 189, originalPrice: 239, recurrences: 2430, lastSeen: "Il y a 2h", rating: 4.2, score: 72, sellers: 13, image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=80&h=80&fit=crop" },
  { id: 24, name: "Pure Cool TP07", brand: "Dyson", category: "Maison", price: 449, originalPrice: 599, recurrences: 2310, lastSeen: "Il y a 1j", rating: 4.6, score: 71, sellers: 9, image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=80&h=80&fit=crop" },
  { id: 25, name: "Sonicare 9900", brand: "Philips", category: "Beauté", price: 199, originalPrice: 299, recurrences: 2200, lastSeen: "Il y a 8h", rating: 4.4, score: 70, sellers: 11, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop" },
];
