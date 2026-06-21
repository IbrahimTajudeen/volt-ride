import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  const shipping = subtotal > 500 ? 0 : 29;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => { setDone(true); clear(); toast.success("Order placed successfully!"); }, 600);
  };

  if (done) {
    return (
      <Layout>
        <section className="container-px mx-auto max-w-2xl py-32 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold">Order confirmed</h1>
          <p className="text-muted-foreground mt-3">A confirmation email is on its way. Track your order anytime in your account.</p>
          <div className="flex gap-3 justify-center mt-8">
            <Link to="/account"><Button variant="hero">View order</Button></Link>
            <Link to="/shop"><Button variant="outline">Continue shopping</Button></Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (items.length === 0) { nav("/cart"); return null; }

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-12">
        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-10">Checkout</h1>
        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-8">
            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4">Contact</h3>
              <input required type="email" placeholder="Email" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
            </div>
            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4">Shipping address</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="First name" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required placeholder="Last name" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required placeholder="Address" className="sm:col-span-2 h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required placeholder="City" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required placeholder="Postal code" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
              </div>
            </div>
            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2">Payment <Lock className="h-4 w-4 text-primary" /></h3>
              <div className="space-y-3">
                <input required placeholder="Card number" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="MM / YY" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                  <input required placeholder="CVC" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                </div>
              </div>
            </div>
          </div>

          <aside className="card-surface rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-display font-bold mb-4">Order summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 text-sm">
                  <div className="h-14 w-14 rounded-md overflow-hidden bg-black shrink-0">
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {qty}</div>
                  </div>
                  <div className="font-semibold">${(product.price * qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-display text-lg font-bold"><span>Total</span><span>${total.toLocaleString()}</span></div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full mt-6">Pay ${total.toLocaleString()}</Button>
          </aside>
        </form>
      </section>
    </Layout>
  );
};

export default Checkout;
