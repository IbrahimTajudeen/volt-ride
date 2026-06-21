import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Package, Heart, MapPin, CreditCard, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { products } from "@/data/products";
import { Link } from "react-router-dom";

const tabs = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "profile", label: "Profile", icon: User },
];

const Account = () => {
  const [tab, setTab] = useState("orders");
  const { wishlist } = useCart();
  const wishItems = products.filter(p => wishlist.includes(p.id));

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-12">
        <h1 className="font-display text-4xl font-bold">My Account</h1>
        <p className="text-muted-foreground mt-2">Welcome back, Rider.</p>

        <div className="mt-10 grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="card-surface rounded-2xl p-3 h-fit">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${tab===t.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </aside>

          <div>
            {tab === "orders" && (
              <div className="space-y-4">
                {[
                  { id: "VR-10238", date: "Jun 14, 2026", status: "Delivered", total: 1899 },
                  { id: "VR-10211", date: "May 28, 2026", status: "Shipped", total: 399 },
                ].map(o => (
                  <div key={o.id} className="card-surface rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="font-display font-bold">{o.id}</div>
                      <div className="text-xs text-muted-foreground">{o.date}</div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${o.status==="Delivered" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>{o.status}</span>
                    <div className="font-display font-bold">${o.total.toLocaleString()}</div>
                    <Button variant="outline" size="sm">Track order</Button>
                  </div>
                ))}
              </div>
            )}
            {tab === "wishlist" && (
              wishItems.length === 0 ? (
                <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">No items in your wishlist yet.</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishItems.map(p => (
                    <Link key={p.id} to={`/product/${p.slug}`} className="card-surface rounded-xl p-4 flex gap-3 hover-lift">
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-black"><img src={p.image} alt="" className="h-full w-full object-cover" /></div>
                      <div>
                        <div className="font-display font-semibold">{p.name}</div>
                        <div className="text-sm text-muted-foreground">${p.price.toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}
            {tab === "addresses" && <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">No saved addresses. <Button variant="link" className="text-primary">Add one</Button></div>}
            {tab === "payment" && <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">No saved cards.</div>}
            {tab === "profile" && (
              <div className="card-surface rounded-2xl p-6 space-y-4 max-w-lg">
                <input placeholder="Full name" defaultValue="Alex Rider" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input placeholder="Email" defaultValue="alex@voltride.com" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input placeholder="Phone" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <Button variant="hero">Save changes</Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
