import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CustomerSitemap } from "@/components/CustomerSitemap";
import { Loader2, Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/I18nProvider";

interface Order { id: string; order_number: string; status: string; total: number; created_at: string; tracking_number: string | null }

const STEPS = ["placed", "processing", "shipped", "delivered"] as const;

const TrackOrder = () => {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const [num, setNum] = useState(params.get("n") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const runLookup = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true); setNotFound(false); setOrder(null);
    const { data } = await supabase.from("orders").select("id, order_number, status, total, created_at, tracking_number").eq("order_number", value.trim()).maybeSingle();
    setLoading(false);
    if (!data) setNotFound(true); else setOrder(data as Order);
  };

  useEffect(() => {
    const n = params.get("n");
    if (n) runLookup(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lookup = (e: React.FormEvent) => { e.preventDefault(); runLookup(num); };

  const stepIndex = (status: string) => {
    if (status === "pending") return 0;
    const i = STEPS.indexOf(status as any);
    return i < 0 ? 0 : i;
  };
  const activeIdx = order ? stepIndex(order.status) : 0;

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-16">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <CustomerSitemap className="h-fit" />
          <div>
            <h1 className="font-display text-4xl font-bold">{t("track.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("track.subtitle")}</p>

            <form onSubmit={lookup} className="mt-8 flex flex-col sm:flex-row gap-3">
              <input value={num} onChange={e => setNum(e.target.value)} placeholder={t("track.orderNumber")}
                className="flex-1 h-12 px-4 rounded-md bg-background border border-border focus:border-primary outline-none" />
              <Button variant="hero" size="lg" type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("track.track")}
              </Button>
            </form>

            {notFound && <div className="mt-8 card-surface rounded-2xl p-8 text-center text-muted-foreground">{t("track.notFound")}</div>}

            {order && (
              <div className="mt-10 card-surface rounded-2xl p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{t("track.orderNumber")}</div>
                    <div className="font-display font-bold text-xl">{order.order_number}</div>
                  </div>
                  <div className="text-end">
                    <div className="text-xs text-muted-foreground">{t("track.total")}</div>
                    <div className="font-display font-bold text-xl">${Number(order.total).toLocaleString()}</div>
                  </div>
                </div>
                {order.tracking_number && (
                  <div className="mt-4 text-sm">
                    <span className="text-muted-foreground">{t("track.tracking")}: </span>
                    <span className="font-mono font-semibold">{order.tracking_number}</span>
                  </div>
                )}
                <div className="mt-8 relative">
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                  <div className="absolute top-5 left-5 h-0.5 bg-primary transition-all" style={{ width: `${(activeIdx/(STEPS.length-1))*100}%` }} />
                  <div className="relative grid grid-cols-4 gap-2">
                    {STEPS.map((s, i) => {
                      const Icon = [Package, Clock, Truck, CheckCircle2][i];
                      const active = i <= activeIdx;
                      return (
                        <div key={s} className="flex flex-col items-center text-center gap-2">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${active ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{t(`track.${s}`)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TrackOrder;