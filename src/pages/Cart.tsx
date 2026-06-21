import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, setQty, remove, subtotal, count } = useCart();
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 29;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <section className="container-px mx-auto max-w-3xl py-32 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-3">Add a bike, scooter, or accessory to get rolling.</p>
          <Link to="/shop"><Button variant="hero" size="lg" className="mt-8">Start shopping</Button></Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-12">
        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2">Your Cart</h1>
        <p className="text-muted-foreground mb-10">{count} item{count !== 1 ? "s" : ""}</p>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-4">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="card-surface rounded-2xl p-4 flex gap-4">
                <Link to={`/product/${product.slug}`} className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-lg overflow-hidden bg-black">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.slug}`} className="font-display font-semibold hover:text-primary">{product.name}</Link>
                  <p className="text-xs text-muted-foreground">{product.tagline}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-border rounded-md">
                      <button onClick={() => setQty(product.id, qty - 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                      <button onClick={() => setQty(product.id, qty + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                    </div>
                    <div className="font-display font-bold">${(product.price * qty).toLocaleString()}</div>
                  </div>
                </div>
                <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive self-start" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          <aside className="card-surface rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-display text-lg font-bold">
                <span>Total</span><span>${total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout"><Button variant="hero" size="lg" className="w-full mt-6">Checkout</Button></Link>
            <p className="text-xs text-muted-foreground text-center mt-3">Secure 256-bit encrypted payment</p>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
