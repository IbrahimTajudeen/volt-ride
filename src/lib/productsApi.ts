import { supabase } from "@/integrations/supabase/client";
import type { Product, Category, ProductVariant } from "@/data/products";
import { products as mockProducts } from "@/data/products";

interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  description_long: string | null;
  category: string;
  price: number | string;
  compare_at: number | string | null;
  stock: number;
  rating: number | string | null;
  reviews: number | null;
  image_url: string | null;
  images: string[] | null;
  variants: ProductVariant[] | null;
  specs: { label: string; value: string }[] | null;
  badge: string | null;
  active: boolean;
}

const FALLBACK_IMG = "/placeholder.svg";

const toProduct = (r: DbProductRow): Product => {
  const variants = Array.isArray(r.variants) ? r.variants : [];
  const images = (r.images && r.images.length ? r.images : [r.image_url || FALLBACK_IMG]).filter(Boolean) as string[];
  const specs = Array.isArray(r.specs) ? r.specs : [];
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline || "",
    category: (r.category as Category) || "accessories",
    price: Number(r.price),
    compareAt: r.compare_at ? Number(r.compare_at) : undefined,
    rating: r.rating ? Number(r.rating) : 5,
    reviews: r.reviews || 0,
    image: r.image_url || images[0] || FALLBACK_IMG,
    images,
    variants,
    specs,
    badge: (r.badge as Product["badge"]) || undefined,
    stock: r.stock || 0,
    description: r.description_long || r.description || "",
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    // graceful fallback to seed catalog so storefront is never empty
    return mockProducts;
  }
  return (data as unknown as DbProductRow[]).map(toProduct);
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    return mockProducts.find((p) => p.slug === slug) || null;
  }
  return toProduct(data as unknown as DbProductRow);
};