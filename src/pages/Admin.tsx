import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, AlertTriangle, DollarSign, TrendingUp, Zap, ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";

const sales = [
  { d: "Mon", v: 4200 }, { d: "Tue", v: 5100 }, { d: "Wed", v: 4800 }, { d: "Thu", v: 6300 },
  { d: "Fri", v: 8200 }, { d: "Sat", v: 9400 }, { d: "Sun", v: 7100 },
];
const max = Math.max(...sales.map(s => s.v));

const stats = [
  { label: "Revenue", value: "$48,210", change: "+12.4%", icon: DollarSign },
  { label: "Orders", value: "324", change: "+8.2%", icon: ShoppingBag },
  { label: "Customers", value: "1,820", change: "+15.1%", icon: Users },
  { label: "Avg. Order", value: "$148", change: "+3.7%", icon: TrendingUp },
];

const Admin = () => {
  const [section, setSection] = useState("dashboard");
  const lowStock = products.filter(p => p.stock < 15);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface/50 p-5 hidden md:flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Zap className="h-5 w-5 text-primary fill-primary" />
          <span className="font-display font-bold">VOLTRIDE</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/15 text-primary">Admin</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "customers", label: "Customers", icon: Users },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map(n => (
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
        </div>

        {section === "dashboard" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display font-bold">Revenue this week</h3>
                    <p className="text-xs text-muted-foreground">Daily sales overview</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Total: $44,100</span>
                </div>
                <div className="flex items-end gap-3 h-48">
                  {sales.map(s => (
                    <div key={s.d} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-primary to-primary-glow rounded-t-md transition-all hover:opacity-80" style={{ height: `${(s.v / max) * 100}%` }} />
                      <span className="text-xs text-muted-foreground">{s.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface rounded-2xl p-6">
                <h3 className="font-display font-bold mb-1 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /> Low Stock Alerts</h3>
                <p className="text-xs text-muted-foreground mb-4">Restock soon</p>
                <div className="space-y-3">
                  {lowStock.map(p => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-black shrink-0"><img src={p.image} alt="" className="h-full w-full object-cover" /></div>
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

            <div className="card-surface rounded-2xl p-6 mt-6">
              <h3 className="font-display font-bold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="py-2">Order</th><th>Customer</th><th>Status</th><th className="text-right">Total</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { id: "#10238", c: "Maya Reyes", s: "Delivered", t: 1899 },
                      { id: "#10237", c: "James Kuo", s: "Processing", t: 2499 },
                      { id: "#10236", c: "Priya Shah", s: "Shipped", t: 399 },
                      { id: "#10235", c: "Lena Park", s: "Delivered", t: 149 },
                    ].map((o, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-3 font-medium">{o.id}</td>
                        <td>{o.c}</td>
                        <td><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.s==="Delivered" ? "bg-primary/15 text-primary" : o.s==="Shipped" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{o.s}</span></td>
                        <td className="text-right font-semibold">${o.t.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {section === "products" && (
          <div className="card-surface rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                <th className="py-2">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th>
              </tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-3 flex items-center gap-3"><div className="h-10 w-10 rounded-md overflow-hidden bg-black"><img src={p.image} alt="" className="h-full w-full object-cover" /></div><span className="font-medium">{p.name}</span></td>
                    <td className="capitalize">{p.category}</td>
                    <td>${p.price.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td>{p.rating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {section === "orders" && <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">Order management UI — connect Lovable Cloud to enable live data.</div>}
        {section === "customers" && <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">Customer directory — enable Cloud for real customer data.</div>}
        {section === "analytics" && <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">Advanced analytics — enable Cloud to track real revenue & sessions.</div>}
      </main>
    </div>
  );
};

export default Admin;
