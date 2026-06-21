import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getProduct, products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, Truck, RotateCcw, Star, Minus, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProduct(slug) : undefined;
  const { add, wishlist, toggleWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState("Matte Black");

  if (!product) {
    return <Layout><div className="container-px py-32 text-center"><h1 className="font-display text-3xl">Product not found</h1><Link to="/shop"><Button className="mt-6">Back to shop</Button></Link></div></Layout>;
  }

  const wished = wishlist.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <span>{product.name}</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square card-surface rounded-2xl overflow-hidden bg-black">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[product.image, product.image, product.image, product.image].map((src, i) => (
                <button key={i} className="aspect-square card-surface rounded-lg overflow-hidden hover:border-primary transition-colors">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
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
              <span className="font-display text-4xl font-bold">${product.price.toLocaleString()}</span>
              {product.compareAt && <span className="text-lg text-muted-foreground line-through">${product.compareAt}</span>}
            </div>

            <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

            {product.specs && (
              <div className="grid grid-cols-2 gap-3 mt-8">
                {product.specs.slice(0, 4).map(s => (
                  <div key={s.label} className="card-surface rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="font-display font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <div className="text-sm font-medium mb-2">Color: <span className="text-muted-foreground">{color}</span></div>
              <div className="flex gap-2">
                {["Matte Black", "Arctic White", "Voltage Orange"].map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-4 py-2 text-xs rounded-md border transition-colors ${color===c ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-12 w-12 flex items-center justify-center hover:bg-secondary"><Plus className="h-4 w-4" /></button>
              </div>
              <Button variant="hero" size="lg" className="flex-1" onClick={() => { add(product, qty); toast.success(`${product.name} added to cart`); }}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)} aria-label="Wishlist">
                <Heart className={wished ? "fill-primary text-primary" : ""} />
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary" /> In stock — ships within 24 hours ({product.stock} available)
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
