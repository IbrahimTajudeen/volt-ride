import bike from "@/assets/cat-bike.jpg";
import scooter from "@/assets/cat-scooter.jpg";
import battery from "@/assets/cat-battery.jpg";
import charger from "@/assets/cat-charger.jpg";
import accessories from "@/assets/cat-accessories.jpg";
import parts from "@/assets/cat-parts.jpg";

export type Category =
  | "bikes"
  | "scooters"
  | "batteries"
  | "chargers"
  | "accessories"
  | "parts";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "New" | "Best Seller" | "Limited";
  stock: number;
  range?: string;
  topSpeed?: string;
  battery?: string;
  specs?: { label: string; value: string }[];
  description?: string;
}

export const categories: { id: Category; name: string; image: string; count: number }[] = [
  { id: "bikes", name: "Electric Bikes", image: bike, count: 18 },
  { id: "scooters", name: "Electric Scooters", image: scooter, count: 24 },
  { id: "batteries", name: "Batteries", image: battery, count: 12 },
  { id: "chargers", name: "Chargers", image: charger, count: 9 },
  { id: "accessories", name: "Accessories", image: accessories, count: 36 },
  { id: "parts", name: "Spare Parts", image: parts, count: 48 },
];

const baseSpecs = (range: string, speed: string, batt: string) => [
  { label: "Range", value: range },
  { label: "Top Speed", value: speed },
  { label: "Battery", value: batt },
  { label: "Charge Time", value: "4.5 hrs" },
  { label: "Motor", value: "750W BLDC" },
  { label: "Warranty", value: "3 years" },
];

export const products: Product[] = [
  {
    id: "p1", slug: "voltride-x1-pro", name: "Voltride X1 Pro", tagline: "Flagship urban scooter",
    category: "scooters", price: 1899, compareAt: 2199, rating: 4.9, reviews: 312,
    image: scooter, badge: "Best Seller", stock: 14,
    range: "85 km", topSpeed: "45 km/h", battery: "48V 20Ah",
    specs: baseSpecs("85 km", "45 km/h", "48V 20Ah"),
    description: "The X1 Pro fuses aerospace-grade aluminum with a torque-rich BLDC motor for an effortless, silent ride.",
  },
  {
    id: "p2", slug: "voltride-trail-e9", name: "Trail E9 Mountain", tagline: "All-terrain e-bike",
    category: "bikes", price: 2499, rating: 4.8, reviews: 187,
    image: bike, badge: "New", stock: 8,
    range: "120 km", topSpeed: "40 km/h", battery: "52V 17.5Ah",
    specs: baseSpecs("120 km", "40 km/h", "52V 17.5Ah"),
    description: "Conquer any terrain with full-suspension geometry and a torque-sensing mid-drive motor.",
  },
  {
    id: "p3", slug: "voltride-city-glide", name: "City Glide", tagline: "Daily commuter scooter",
    category: "scooters", price: 999, compareAt: 1199, rating: 4.7, reviews: 521,
    image: scooter, badge: "Best Seller", stock: 32,
    range: "55 km", topSpeed: "32 km/h", battery: "36V 15Ah",
    specs: baseSpecs("55 km", "32 km/h", "36V 15Ah"),
    description: "Lightweight, foldable, and built for the daily commute.",
  },
  {
    id: "p4", slug: "voltride-urban-step", name: "Urban Step", tagline: "Step-through e-bike",
    category: "bikes", price: 1799, rating: 4.6, reviews: 142,
    image: bike, stock: 11,
    range: "95 km", topSpeed: "32 km/h", battery: "48V 14Ah",
    specs: baseSpecs("95 km", "32 km/h", "48V 14Ah"),
    description: "Comfort-first geometry meets refined city styling.",
  },
  {
    id: "p5", slug: "powercell-72v-pro", name: "PowerCell 72V Pro", tagline: "Long-range battery pack",
    category: "batteries", price: 649, rating: 4.8, reviews: 96, image: battery, badge: "New", stock: 22,
    description: "High-density lithium battery with smart BMS and IP67 housing.",
  },
  {
    id: "p6", slug: "boltcharger-fast-7kw", name: "BoltCharger 7kW", tagline: "Fast home charger",
    category: "chargers", price: 399, rating: 4.7, reviews: 64, image: charger, stock: 40,
    description: "Cut charge times in half with our 7kW smart wall unit.",
  },
  {
    id: "p7", slug: "aero-helmet-pro", name: "Aero Helmet Pro", tagline: "DOT-certified safety",
    category: "accessories", price: 149, rating: 4.9, reviews: 233, image: accessories, badge: "Best Seller", stock: 60,
    description: "Lightweight composite shell with integrated LED tail light.",
  },
  {
    id: "p8", slug: "torque-motor-kit", name: "Torque Motor Kit", tagline: "Replacement BLDC motor",
    category: "parts", price: 289, rating: 4.6, reviews: 41, image: parts, stock: 18,
    description: "OEM-spec brushless motor with sealed bearings.",
  },
];

export const getProduct = (slug: string) => products.find(p => p.slug === slug);
export const byCategory = (c: Category) => products.filter(p => p.category === c);