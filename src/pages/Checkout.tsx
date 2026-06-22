import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || "", firstName: "", lastName: "",
    address: "", city: "", postal: "",
    cardNumber: "", expiry: "", cvc: "",
  });

  const shipping = subtotal > 500 ? 0 : 29;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order.");
      nav("/auth?mode=login");
      return;
    }
    setLoading(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user.id,
        subtotal, shipping, tax, total,
        payment_method: "card",
        shipping_address: {
          name: `${form.firstName} ${form.lastName}`,
          address: form.address, city: form.city, postal: form.postal,
        },
      }).select("id, order_number").single();
      if (error) throw error;

      const orderItems = items.map(({ product, qty }) => ({
        order_id: order.id, name: product.name, price: product.price, qty,
      }));
      await supabase.from("order_items").insert(orderItems);

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: `Order ${order.order_number} confirmed`,
        body: `We're preparing your order — total $${total.toLocaleString()}.`,
        type: "order", link: "/account",
      });

      setOrderNum(order.order_number);
      setDone(true);
      clear();
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Layout>
        <section className="container-px mx-auto max-w-2xl py-32 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold">Order confirmed</h1>
          <p className="text-muted-foreground mt-3">Order <span className="font-semibold text-foreground">{orderNum}</span> — a confirmation email is on its way.</p>
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
        {!user && (
          <div className="card-surface rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm">Have an account? Sign in for a faster checkout.</p>
            <Link to="/auth"><Button variant="outline" size="sm">Sign in</Button></Link>
          </div>
        )}
        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-8">
            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4">Contact</h3>
              <input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
            </div>
            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4">Shipping address</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} placeholder="First name" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} placeholder="Last name" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required value={form.address} onChange={e=>setForm({...form, address: e.target.value})} placeholder="Address" className="sm:col-span-2 h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required value={form.city} onChange={e=>setForm({...form, city: e.target.value})} placeholder="City" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input required value={form.postal} onChange={e=>setForm({...form, postal: e.target.value})} placeholder="Postal code" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
              </div>
            </div>
            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2">Payment <Lock className="h-4 w-4 text-primary" /></h3>
              <div className="space-y-3">
                <input required value={form.cardNumber} onChange={e=>setForm({...form, cardNumber: e.target.value})} placeholder="Card number" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input required value={form.expiry} onChange={e=>setForm({...form, expiry: e.target.value})} placeholder="MM / YY" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                  <input required value={form.cvc} onChange={e=>setForm({...form, cvc: e.target.value})} placeholder="CVC" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Demo mode — no card is charged. Payment provider will be connected next.</p>
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
            <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay $${total.toLocaleString()}`}
            </Button>
          </aside>
        </form>
      </section>
    </Layout>
  );
};

export default Checkout;