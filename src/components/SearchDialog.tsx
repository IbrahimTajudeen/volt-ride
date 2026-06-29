import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { useI18n } from "@/i18n/I18nProvider";

interface Props { open: boolean; onOpenChange: (o: boolean) => void }

export const SearchDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useI18n();
  const [q, setQ] = useState("");

  useEffect(() => { if (!open) setQ(""); }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return products.slice(0, 6);
    const s = q.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.tagline.toLowerCase().includes(s) ||
      p.category.includes(s)
    ).slice(0, 8);
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent outline-none text-base" />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t("search.empty")}</div>
          ) : (
            <ul className="divide-y divide-border/60">
              {results.map(p => (
                <li key={p.id}>
                  <Link to={`/product/${p.slug}`} onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary transition-colors">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-black shrink-0">
                      <img src={p.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{p.tagline}</div>
                    </div>
                    <div className="text-sm font-semibold">${p.price.toLocaleString()}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};