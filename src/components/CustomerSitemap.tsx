import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { User, Package, MapPin, Bell, Map, ArrowLeft, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerSitemapProps {
  className?: string;
  showBack?: boolean;
  title?: boolean;
}

const CustomerSitemap = ({ className, showBack = true, title = true }: CustomerSitemapProps) => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isRtl = lang === "he";

  const links = [
    { to: "/account", label: t("sitemap.account"), icon: User },
    { to: "/account", label: t("sitemap.orders"), icon: Package, hash: "orders" },
    { to: "/track-order", label: t("sitemap.trackOrder"), icon: Package },
    { to: "/addresses", label: t("sitemap.addresses"), icon: MapPin },
    { to: "/notifications", label: t("sitemap.notifications"), icon: Bell },
  ];

  const isActive = (to: string, hash?: string) => {
    if (to !== location.pathname) return false;
    if (!hash) return true;
    return true;
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const LinkArrow = isRtl ? ChevronLeft : ChevronRight;

  return (
    <nav className={cn("card-surface rounded-2xl p-4", className)} aria-label={t("account.sitemap")}>
      {showBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="w-full justify-start gap-2 mb-4 text-muted-foreground hover:text-foreground"
        >
          <BackIcon className="h-4 w-4" />
          {t("common.back")}
        </Button>
      )}
      {title && (
        <div className="flex items-center gap-2 mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Map className="h-4 w-4" />
          {t("account.sitemap")}
        </div>
      )}
      <ul className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to, link.hash);
          return (
            <li key={link.label + link.to}>
              <Link
                to={link.to + (link.hash ? `#${link.hash}` : "")}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{link.label}</span>
                {!active && <LinkArrow className="h-4 w-4 opacity-50" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { CustomerSitemap };