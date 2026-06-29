import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CustomerSitemap } from "@/components/CustomerSitemap";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

interface Address {
  id: string; label: string; recipient: string; line1: string; line2: string | null;
  city: string; region: string | null; postal_code: string; country: string;
  phone: string | null; is_default: boolean;
}

const empty = { label: "Home", recipient: "", line1: "", line2: "", city: "", region: "", postal_code: "", country: "US", phone: "", is_default: false };

const Addresses = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false });
    setItems((data as Address[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [user]);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (a: Address) => {
    setEditing(a);
    setForm({ ...empty, ...a, line2: a.line2 || "", region: a.region || "", phone: a.phone || "" });
    setOpen(true);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = { ...form, user_id: user.id, line2: form.line2 || null, region: form.region || null, phone: form.phone || null };
    let err;
    if (editing) {
      ({ error: err } = await supabase.from("addresses").update(payload).eq("id", editing.id));
    } else {
      ({ error: err } = await supabase.from("addresses").insert(payload));
    }
    setSaving(false);
    if (err) return toast.error(err.message);
    if (form.is_default) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id).neq("id", editing?.id || "00000000-0000-0000-0000-000000000000");
    }
    toast.success(t("address.saved"));
    setOpen(false); load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(t("address.deleted")); load();
  };

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold">{t("account.tabs.addresses")}</h1>
            <p className="text-muted-foreground mt-2">{t("account.manageAddresses")}</p>
          </div>
          <Button variant="hero" onClick={openNew}><Plus className="h-4 w-4" />{t("address.addNew")}</Button>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <CustomerSitemap className="h-fit" />
          <div>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : items.length === 0 ? (
              <div className="card-surface rounded-2xl p-12 text-center text-muted-foreground">{t("account.noAddresses")}</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map(a => (
                  <div key={a.id} className="card-surface rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-2 items-center">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-display font-semibold">{a.label}</span>
                        {a.is_default && <span className="text-[10px] uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="h-3 w-3 fill-primary" />{t("address.default")}</span>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm space-y-0.5">
                      <div className="font-medium">{a.recipient}</div>
                      <div className="text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</div>
                      <div className="text-muted-foreground">{a.city}{a.region ? `, ${a.region}` : ""} {a.postal_code}</div>
                      <div className="text-muted-foreground">{a.country}</div>
                      {a.phone && <div className="text-muted-foreground">{a.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? t("address.edit") : t("address.addNew")}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              {[
                ["label", "label"], ["recipient", "recipient"], ["line1", "line1"], ["line2", "line2"],
                ["city", "city"], ["region", "region"], ["postal_code", "postal"], ["country", "country"], ["phone", "phone"],
              ].map(([field, key]) => (
                <input key={field} placeholder={t(`address.${key}`)}
                  value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
              ))}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_default} onChange={e => setForm({ ...form, is_default: e.target.checked })} />
                {t("address.setDefault")}
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
              <Button variant="hero" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  );
};

export default Addresses;