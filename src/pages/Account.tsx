import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Package, Heart, MapPin, CreditCard, User, LogOut, Loader2, Bell, ArrowLeft, ArrowRight, Map as MapIcon } from "lucide-react";
import { useCart } from "@/store/cart";
import { fetchProducts } from "@/lib/productsApi";
import type { Product } from "@/data/products";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Order { id: string; order_number: string; status: string; total: number; created_at: string }

const Account = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isRtl = lang === "he";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const tabs = [
    { id: "orders", label: t("account.tabs.orders"), icon: Package, external: null },
    { id: "wishlist", label: t("account.tabs.wishlist"), icon: Heart, external: null },
    { id: "addresses", label: t("account.tabs.addresses"), icon: MapPin, external: "/addresses" },
    { id: "notifications", label: t("nav.notifications"), icon: Bell, external: "/notifications" },
    { id: "track", label: t("sitemap.trackOrder"), icon: Package, external: "/track-order" },
    { id: "payment", label: t("account.tabs.payment"), icon: CreditCard, external: null },
    { id: "profile", label: t("account.tabs.profile"), icon: User, external: null },
  ];

  const initialTab = tabs.find(x => x.id === location.hash.replace("#", ""))?.id || "orders";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (id && tabs.some(x => x.id === id)) setTab(id);
  }, [location.hash]);

  const { wishlist } = useCart();
  const { user, signOut } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => { fetchProducts().then(setAllProducts); }, []);
  const wishItems = useMemo(() => allProducts.filter(p => wishlist.includes(p.id)), [allProducts, wishlist]);

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

  const handleTab = (id: string, external: string | null) => {
    if (external) navigate(external);
    else { setTab(id); navigate(`#${id}`, { replace: true }); }
  };

  const SideNav = (
    <aside className="card-surface rounded-2xl p-3 h-fit sticky top-20" aria-label={t("account.sitemap")}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}
        className="w-full justify-start gap-2 mb-3 text-muted-foreground hover:text-foreground">
        <BackIcon className="h-4 w-4" /> {t("common.back")}
      </Button>
      <div className="flex items-center gap-2 mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <MapIcon className="h-3.5 w-3.5" /> {t("account.sitemap")}
      </div>
      {tabs.map(x => (
        <button key={x.id} onClick={() => handleTab(x.id, x.external)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            tab === x.id && !x.external ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}>
          <x.icon className="h-4 w-4" /> {x.label}
        </button>
      ))}
      <div className="border-t border-border/60 mt-3 pt-3 px-1">
        <Link to="/shop" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary">{t("sitemap.shop")} →</Link>
        <Link to="/faqs" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary">{t("sitemap.faqs")} →</Link>
        <Link to="/contact" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary">{t("sitemap.contact")} →</Link>
      </div>
    </aside>
  );

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-10 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">{t("account.sitemap")}</p>
            <h1 className="font-display text-3xl lg:text-4xl font-bold">{t("account.title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("account.welcome", { name: profile.full_name || user?.email?.split("@")[0] || "" })}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4" />{t("nav.signOut")}</Button>
        </div>

        {/* Mobile tab strip */}
        <div className="lg:hidden -mx-4 px-4 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map(x => (
              <button key={x.id} onClick={() => handleTab(x.id, x.external)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-colors",
                  tab === x.id && !x.external ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"
                )}>
                <x.icon className="h-3.5 w-3.5" /> {x.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <div className="hidden lg:block">{SideNav}</div>

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
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-black shrink-0"><img src={p.image} alt="" className="h-full w-full object-cover" /></div>
                      <div>
                        <div className="font-display font-semibold">{p.name}</div>
                        <div className="text-sm text-muted-foreground">${p.price.toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
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