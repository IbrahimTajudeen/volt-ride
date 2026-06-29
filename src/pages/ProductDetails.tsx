import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Product } from "@/data/products";
import { fetchProductBySlug, fetchProducts } from "@/lib/productsApi";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, Truck, RotateCcw, Star, Minus, Plus, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { add, wishlist, toggleWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug).then((p) => {
      setProduct(p);
      setVariantId(p?.variants?.[0]?.id || null);
      setActiveImg(0);
      setLoading(false);
      if (p) fetchProducts().then((all) =>
        setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4))
      );
    });
  }, [slug]);

  const activeVariant = useMemo(
    () => product?.variants?.find((v) => v.id === variantId) || null,
    [product, variantId]
  );

  const gallery = useMemo(() => {
    if (!product) return [];
    const v = activeVariant;
    if (v?.images?.length) return v.images;
    if (v?.image) return [v.image, ...(product.images || []).filter((i) => i !== v.image)];
    if (product.images?.length) return product.images;
    return [product.image];
  }, [product, activeVariant]);

  useEffect(() => { setActiveImg(0); }, [variantId]);

  if (loading) {
    return <Layout><div className="container-px py-32 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }
  if (!product) {
    return <Layout><div className="container-px py-32 text-center"><h1 className="font-display text-3xl">Product not found</h1><Link to="/shop"><Button className="mt-6">Back to shop</Button></Link></div></Layout>;
  }

  const wished = wishlist.includes(product.id);
  const effectivePrice = product.price + (activeVariant?.price_modifier || 0);
  const stockLeft = activeVariant?.stock ?? product.stock;

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <span>{product.name}</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square card-surface rounded-2xl overflow-hidden bg-black">
              <img key={gallery[activeImg]} src={gallery[activeImg]} alt={product.name} className="h-full w-full object-cover animate-fade-in" />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.slice(0, 8).map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={cn(
                      "aspect-square card-surface rounded-lg overflow-hidden border-2 transition-colors",
                      activeImg === i ? "border-primary" : "border-transparent hover:border-primary/50"
                    )}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.badge && <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">{product.badge}</span>}
            <h1 className="font-display text-4xl lg:text-5xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.tagline}</p>

            <div className="flex items-center gap-2 mt-4 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">· {product.reviews} reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold">${effectivePrice.toLocaleString()}</span>
              {product.compareAt && <span className="text-lg text-muted-foreground line-through">${product.compareAt}</span>}
            </div>

            {product.description && <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>}

            {product.specs && product.specs.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-8">
                {product.specs.slice(0, 4).map(s => (
                  <div key={s.label} className="card-surface rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="font-display font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <div className="text-sm font-medium mb-2">
                  Variant: <span className="text-muted-foreground">{activeVariant?.name || "—"}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setVariantId(v.id)}
                      className={cn(
                        "px-4 py-2 text-xs rounded-md border transition-colors flex items-center gap-2",
                        variantId === v.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                      )}>
                      {v.color && <span className="inline-block h-3 w-3 rounded-full border border-border" style={{ background: v.color }} />}
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Plus className="h-4 w-4" /></button>
              </div>
              <Button variant="hero" size="lg" className="flex-1" disabled={stockLeft <= 0} onClick={() => {
                const snapshot: Product = activeVariant
                  ? { ...product, id: `${product.id}::${activeVariant.id}`, name: `${product.name} — ${activeVariant.name}`, price: effectivePrice, image: gallery[0] }
                  : product;
                add(snapshot, qty);
                toast.success(`${snapshot.name} added to cart`);
              }}>
                {stockLeft <= 0 ? "Out of stock" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)} aria-label="Wishlist">
                <Heart className={wished ? "fill-primary text-primary" : ""} />
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary" />
              {stockLeft > 0 ? `In stock — ships within 24 hours (${stockLeft} available)` : "Currently out of stock"}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 pt-8 border-t border-border">
              {[
                { icon: Truck, t: "Free delivery" },
                { icon: ShieldCheck, t: "3-yr warranty" },
                { icon: RotateCcw, t: "30-day returns" },
              ].map((b, i) => (
                <div key={i} className="text-center">
                  <b.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <div className="text-xs">{b.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-20">
          <h2 className="font-display text-3xl font-bold mb-8">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetails;