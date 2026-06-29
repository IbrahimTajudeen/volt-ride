import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, AlertTriangle, DollarSign, TrendingUp, Zap, ArrowUpRight, Plus, Pencil, Trash2, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

interface DbProduct {
  id: string; slug: string; name: string; tagline: string | null; description: string | null;
  category: string; price: number; compare_at: number | null; stock: number;
  rating: number | null; reviews: number | null; image_url: string | null; badge: string | null; active: boolean;
}
interface Order { id: string; order_number: string; status: string; total: number; created_at: string; user_id: string | null }
interface Msg { id: string; name: string; email: string; subject: string | null; message: string; created_at: string }

const emptyProduct = {
  slug: "", name: "", tagline: "", description: "", category: "bikes",
  price: 0, compare_at: null as number | null, stock: 0, image_url: "", badge: "", active: true,
};

const Admin = () => {
  const [section, setSection] = useState("dashboard");
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [form, setForm] = useState<typeof emptyProduct>(emptyProduct);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [p, o, m] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setProducts((p.data as DbProduct[]) || []);
    setOrders((o.data as Order[]) || []);
    setMessages((m.data as Msg[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const lowStock = products.filter(p => p.stock < 15);
  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);

  // Derived analytics
  const salesTrend = useMemo(() => {
    const days = 14;
    const buckets: { d: string; revenue: number; orders: number }[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date(today); dt.setDate(today.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      const label = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const dayOrders = orders.filter(o => o.created_at.slice(0, 10) === key);
      buckets.push({
        d: label,
        revenue: dayOrders.reduce((s, o) => s + Number(o.total), 0),
        orders: dayOrders.length,
      });
    }
    return buckets;
  }, [orders]);

  const statusMix = useMemo(() => {
    const m: Record<string, number> = {};
    orders.forEach(o => { m[o.status] = (m[o.status] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const categoryMix = useMemo(() => {
    const m: Record<string, number> = {};
    products.forEach(p => { m[p.category] = (m[p.category] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [products]);

  const topProducts = useMemo(() =>
    [...products]
      .sort((a, b) => (Number(b.price) * (b.reviews || 0)) - (Number(a.price) * (a.reviews || 0)))
      .slice(0, 6)
      .map(p => ({ name: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name, revenue: Number(p.price) * (p.reviews || 1) })),
    [products]);

  const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(var(--destructive))", "hsl(var(--ring))", "hsl(var(--secondary-foreground))"];


  const startNew = () => { setEditing(null); setForm(emptyProduct); setOpen(true); };
  const startEdit = (p: DbProduct) => {
    setEditing(p);
    setForm({
      slug: p.slug, name: p.name, tagline: p.tagline || "", description: p.description || "",
      category: p.category, price: Number(p.price), compare_at: p.compare_at ? Number(p.compare_at) : null,
      stock: p.stock, image_url: p.image_url || "", badge: p.badge || "", active: p.active,
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      compare_at: form.compare_at || null,
      badge: form.badge || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Product updated" : "Product added");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    load();
  };

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border bg-surface/50 p-5 hidden md:flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Zap className="h-5 w-5 text-primary fill-primary" />
          <span className="font-display font-bold">VOLTRIDE</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/15 text-primary">Admin</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {nav.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${section===n.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
        </nav>
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Back to store</Link>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold capitalize">{section}</h1>
            <p className="text-sm text-muted-foreground">Last updated just now</p>
          </div>
          {section === "products" && (
            <Button variant="hero" onClick={startNew}><Plus className="h-4 w-4" />New product</Button>
          )}
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}

        {!loading && section === "dashboard" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Revenue", value: `$${revenue.toLocaleString()}`, change: "+12.4%", icon: DollarSign },
                { label: "Orders", value: orders.length.toString(), change: "+8.2%", icon: ShoppingBag },
                { label: "Products", value: products.length.toString(), change: "+5.0%", icon: Package },
                { label: "Avg. Order", value: orders.length ? `$${Math.round(revenue / orders.length).toLocaleString()}` : "$0", change: "+3.7%", icon: TrendingUp },
              ].map((s, i) => (
                <div key={i} className="card-surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><s.icon className="h-5 w-5 text-primary" /></div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />{s.change}</span>
                  </div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="card-surface rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold">Revenue trend</h3>
                    <p className="text-xs text-muted-foreground">Last 14 days</p>
                  </div>
                  <span className="text-xs font-semibold text-primary flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />Live</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={salesTrend}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card-surface rounded-2xl p-6">
                <h3 className="font-display font-bold mb-1">Order status</h3>
                <p className="text-xs text-muted-foreground mb-2">Pipeline breakdown</p>
                {statusMix.length === 0 ? (
                  <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">No orders yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={statusMix} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                        {statusMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="card-surface rounded-2xl p-6 lg:col-span-2">
                <h3 className="font-display font-bold mb-1">Top products by traction</h3>
                <p className="text-xs text-muted-foreground mb-4">Estimated revenue weight</p>
                {topProducts.length === 0 ? (
                  <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">No products yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={110} />
                      <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="card-surface rounded-2xl p-6">
                <h3 className="font-display font-bold mb-1 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /> Low Stock</h3>
                <p className="text-xs text-muted-foreground mb-4">Restock soon</p>
                <div className="space-y-3">
                  {lowStock.length === 0 && <p className="text-sm text-muted-foreground">All products stocked.</p>}
                  {lowStock.slice(0, 6).map(p => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.stock} left</div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-destructive/15 text-destructive">Low</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}


        {!loading && section === "products" && (
          <div className="card-surface rounded-2xl p-6 overflow-x-auto">
            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No products yet. Click "New product" to add one.</div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="py-2">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th>
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="capitalize">{p.category}</td>
                      <td>${Number(p.price).toLocaleString()}</td>
                      <td>{p.stock}</td>
                      <td><span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{p.active ? "Active" : "Hidden"}</span></td>
                      <td className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && section === "orders" && (
          <div className="card-surface rounded-2xl p-6 overflow-x-auto">
            {orders.length === 0 ? <div className="text-center py-12 text-muted-foreground">No orders yet.</div> : (
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="py-2">Order</th><th>Date</th><th>Status</th><th>Total</th><th></th>
                </tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="py-3 font-medium">{o.order_number}</td>
                      <td>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td>
                        <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                          className="h-8 px-2 rounded-md bg-secondary border border-border text-xs capitalize">
                          {["processing","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="font-semibold">${Number(o.total).toLocaleString()}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && section === "messages" && (
          <div className="space-y-3">
            {messages.length === 0 ? <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">No messages yet.</div> :
              messages.map(m => (
                <div key={m.id} className="card-surface rounded-xl p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <div className="font-semibold">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></div>
                      {m.subject && <div className="text-sm text-muted-foreground">{m.subject}</div>}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                </div>
              ))}
          </div>
        )}

        {!loading && section === "customers" && <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">Customer directory coming soon.</div>}
        {!loading && section === "analytics" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-1">Orders volume</h3>
              <p className="text-xs text-muted-foreground mb-4">Daily order count, last 14 days</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card-surface rounded-2xl p-6">
              <h3 className="font-display font-bold mb-1">Catalog by category</h3>
              <p className="text-xs text-muted-foreground mb-4">Inventory distribution</p>
              {categoryMix.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No products yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryMix} dataKey="value" nameKey="name" outerRadius={90} label={{ fontSize: 11 }}>
                      {categoryMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="card-surface rounded-2xl p-6 lg:col-span-2">
              <h3 className="font-display font-bold mb-1">Stock levels</h3>
              <p className="text-xs text-muted-foreground mb-4">Units on hand across the catalog</p>
              {products.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No products yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={products.map(p => ({ name: p.name.length > 12 ? p.name.slice(0,12)+"…" : p.name, stock: p.stock }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")})} className="col-span-2 h-10 px-3 rounded-md bg-background border border-border" />
            <input placeholder="Slug (url-friendly)" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value})} className="col-span-2 h-10 px-3 rounded-md bg-background border border-border" />
            <input placeholder="Tagline" value={form.tagline} onChange={e=>setForm({...form, tagline: e.target.value})} className="col-span-2 h-10 px-3 rounded-md bg-background border border-border" />
            <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={3} className="col-span-2 p-3 rounded-md bg-background border border-border resize-none" />
            <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="h-10 px-3 rounded-md bg-background border border-border">
              {["bikes","scooters","batteries","chargers","accessories","parts"].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
            <select value={form.badge} onChange={e=>setForm({...form, badge: e.target.value})} className="h-10 px-3 rounded-md bg-background border border-border">
              <option value="">No badge</option>
              {["New","Best Seller","Limited"].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price: parseFloat(e.target.value) || 0})} className="h-10 px-3 rounded-md bg-background border border-border" />
            <input type="number" step="0.01" placeholder="Compare-at (optional)" value={form.compare_at || ""} onChange={e=>setForm({...form, compare_at: parseFloat(e.target.value) || null})} className="h-10 px-3 rounded-md bg-background border border-border" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock: parseInt(e.target.value) || 0})} className="h-10 px-3 rounded-md bg-background border border-border" />
            <input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} className="h-10 px-3 rounded-md bg-background border border-border" />
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={e=>setForm({...form, active: e.target.checked})} /> Visible in storefront
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={save} disabled={saving || !form.name || !form.slug}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editing ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;