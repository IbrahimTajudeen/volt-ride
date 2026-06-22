import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Bell, Check, Package, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface N { id: string; title: string; body: string | null; type: string; link: string | null; read: boolean; created_at: string }

const iconFor = (t: string) =>
  t === "order" ? Package : t === "payment" ? CreditCard : t === "security" ? ShieldCheck : Bell;

const Notifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<N[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems((data as N[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAll = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Layout>
      <section className="container-px mx-auto max-w-3xl py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">Order updates, deliveries, and account alerts.</p>
          </div>
          {items.some(n => !n.read) && <Button variant="outline" size="sm" onClick={markAll}><Check className="h-4 w-4" />Mark all read</Button>}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="card-surface rounded-2xl p-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet. We'll ping you when something happens.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(n => {
              const Icon = iconFor(n.type);
              return (
                <div key={n.id} onClick={() => !n.read && markRead(n.id)}
                  className={`card-surface rounded-xl p-4 flex gap-4 cursor-pointer transition-colors ${!n.read ? "border-primary/40" : ""}`}>
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-semibold text-sm">{n.title}</h3>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    {n.body && <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Notifications;