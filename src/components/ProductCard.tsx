import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ProductCard = ({ product }: { product: Product }) => {
  const { add, wishlist, toggleWishlist } = useCart();
  const wished = wishlist.includes(product.id);

  return (
    <div className="group card-surface rounded-2xl overflow-hidden hover-lift">
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-black">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge && (
          <span className={cn(
            "absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md",
            product.badge === "New" && "bg-accent text-accent-foreground",
            product.badge === "Best Seller" && "bg-primary text-primary-foreground",
            product.badge === "Limited" && "bg-foreground text-background"
          )}>{product.badge}</span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-primary text-primary")} />
        </button>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{product.tagline}</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold">${product.price.toLocaleString()}</span>
              {product.compareAt && <span className="text-sm text-muted-foreground line-through">${product.compareAt}</span>}
            </div>
          </div>
          <Button size="sm" variant="default" onClick={() => add(product)}>Add</Button>
        </div>
      </div>
    </div>
  );
};
