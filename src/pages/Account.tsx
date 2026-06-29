import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CustomerSitemap } from "@/components/CustomerSitemap";
import { Package, Heart, MapPin, CreditCard, User, LogOut, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { products } from "@/data/products";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

interface Order { id: string; order_number: string; status: string; total: number; created_at: string }

const Account = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = [
    { id: "orders", label: t("account.tabs.orders"), icon: Package },
    { id: "wishlist", label: t("account.tabs.wishlist"), icon: Heart },
    { id: "addresses", label: t("account.tabs.addresses"), icon: MapPin },
    { id: "payment", label: t("account.tabs.payment"), icon: CreditCard },
    { id: "profile", label: t("account.tabs.profile"), icon: User },
  ];
  const initialTab = tabs.find(t => t.id === location.hash.replace("#", ""))?.id || "orders";
  const [tab, setTab] = useState(initialTab);
  const { wishlist } = useCart();
  const { user, signOut } = useAuth();
  const wishItems = products.filter(p => wishlist.includes(p.id));
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("orders").select("id, order_number, status, total, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
    ]).then(([o, p]) => {
      setOrders((o.data as Order[]) || []);
      if (p.data) setProfile({ full_name: p.data.full_name || "", phone: p.data.phone || "" });
      setLoading(false);
    });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile updated.");
  };

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold">{t("account.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("account.welcome", { name: profile.full_name || user?.email?.split("@")[0] || "" })}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4" />{t("nav.signOut")}</Button>
        </div>

        <div className="mt-10 grid lg:grid-cols-[260px_1fr] gap-8">
          <div className="space-y-6">
            <CustomerSitemap />
            <aside className="card-surface rounded-2xl p-3 h-fit">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${tab===t.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </aside>
          </div>

          <div>
            {tab === "orders" && (
              loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> :
              orders.length === 0 ? <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">{t("account.noOrders")} <Link to="/shop" className="text-primary hover:underline">{t("account.startShopping")}</Link></div> :
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="card-surface rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="font-display font-bold">{o.order_number}</div>
                      <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${o.status==="delivered" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>{o.status}</span>
                    <div className="font-display font-bold">${Number(o.total).toLocaleString()}</div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/track-order?n=${o.order_number}`)}>{t("account.trackOrder")}</Button>
                  </div>
                ))}
              </div>
            )}
            {tab === "wishlist" && (
              wishItems.length === 0 ? (
                <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">{t("account.noWishlist")}</div>
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
            {tab === "addresses" && (
              <div className="card-surface rounded-2xl p-12 text-center">
                <p className="text-muted-foreground mb-4">{t("account.manageAddresses")}</p>
                <Link to="/addresses"><Button variant="hero">{t("account.tabs.addresses")} →</Button></Link>
              </div>
            )}
            {tab === "payment" && <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">{t("account.noPayment")}</div>}
            {tab === "profile" && (
              <div className="card-surface rounded-2xl p-6 space-y-4 max-w-lg">
                <input placeholder={t("account.fullName")} value={profile.full_name} onChange={e=>setProfile({...profile, full_name: e.target.value})} className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <input placeholder={t("account.email")} defaultValue={user?.email || ""} disabled className="w-full h-11 px-3 rounded-md bg-secondary border border-border outline-none text-muted-foreground" />
                <input placeholder={t("account.phone")} value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})} className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
                <Button variant="hero" onClick={saveProfile} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("account.save")}</Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;