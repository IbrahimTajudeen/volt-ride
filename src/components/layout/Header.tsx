import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, Sun, Moon, X, Bell, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { useCart } from "@/store/cart";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SearchDialog } from "@/components/SearchDialog";

export const Header = () => {
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const nav = useNavigate();

  const navLeft = [
    { to: "/shop", label: t("nav.shop") },
    { to: "/categories", label: t("nav.categories") },
    { to: "/blog", label: t("nav.blog") },
  ];
  const navRight = [
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/faqs", label: t("nav.faqs") },
  ];

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false)
      .then(({ count }) => setUnread(count || 0));
  }, [user]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="container-px mx-auto max-w-7xl grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-4">
          <nav className="hidden lg:flex items-center gap-1 justify-start">
            {navLeft.map(n => <NavLink key={n.to} to={n.to} className={linkClass}>{n.label}</NavLink>)}
          </nav>

          <div className="lg:hidden flex justify-start">
            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label={t("nav.menu")}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <Link to="/" className="flex items-center justify-center gap-2 group">
            {/* Logo image: hidden on mobile, visible on lg+ */}
            <img
              src="/volt-ride-logo.png"
              alt="Volt Ride logo"
              loading="lazy"
              width={800}
              height={800}
              className="hidden lg:inline relative h-20 w-20 bg-transparent"
            />
            {/* Title: smaller on mobile so it fits the header without overflow */}
            <span className="font-display text-base sm:text-lg lg:text-2xl font-bold tracking-[0.12em] sm:tracking-[0.18em] uppercase leading-none">
              Volt<span className="text-primary">ride</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 justify-end">
            <nav className="hidden xl:flex items-center gap-1 mr-2">
              {navRight.map(n => <NavLink key={n.to} to={n.to} className={linkClass}>{n.label}</NavLink>)}
            </nav>
            <Button variant="ghost" size="icon" aria-label={t("nav.search")} onClick={() => setSearchOpen(true)} className="hidden sm:inline-flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Language switcher: hidden on mobile (replaced by floating button below) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("nav.language")} className="hidden lg:inline-flex">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setLang("en")}>
                  <span className={lang === "en" ? "font-semibold text-primary" : ""}>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("he")}>
                  <span className={lang === "he" ? "font-semibold text-primary" : ""}>עברית</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" aria-label={t("nav.toggleTheme")} onClick={toggle}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {user && (
              <Link to="/notifications" className="relative">
                <Button variant="ghost" size="icon" aria-label={t("nav.notifications")}>
                  <Bell className="h-5 w-5" />
                </Button>
                {unread > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">{unread}</span>
                )}
              </Link>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t("nav.account")}><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav("/account")}><User className="h-4 w-4 mr-2" />{t("nav.account")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/notifications")}><Bell className="h-4 w-4 mr-2" />{t("nav.notifications")}</DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem onClick={() => nav("/admin")}><LayoutDashboard className="h-4 w-4 mr-2" />{t("nav.admin")}</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}><LogOut className="h-4 w-4 mr-2" />{t("nav.signOut")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">{t("nav.signIn")}</Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label={t("nav.cart")}><ShoppingCart className="h-5 w-5" /></Button>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">{count}</span>
              )}
            </Link>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-border/60 bg-background animate-fade-in">
            <div className="container-px mx-auto max-w-7xl py-3 flex flex-col">
              {[...navLeft, ...navRight].map(n => (
                <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium border-b border-border/40 last:border-0">
                  {n.label}
                </NavLink>
              ))}
              <button onClick={() => { setOpen(false); setSearchOpen(true); }} className="py-3 text-sm font-medium text-start border-b border-border/40">
                {t("nav.search")}
              </button>
              {!user && (
                <Link to="/auth" onClick={() => setOpen(false)} className="py-3 text-sm font-semibold text-primary">{t("nav.signIn")}</Link>
              )}
            </div>
          </nav>
        )}

        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </header>

      {/* Floating language switcher — mobile only */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg shadow-black/20 border border-border/60 bg-background/90 backdrop-blur-md hover:bg-accent"
              aria-label={t("nav.language")}
            >
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-36 mb-2">
            <DropdownMenuItem onClick={() => setLang("en")}>
              <span className={lang === "en" ? "font-semibold text-primary" : ""}>English</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang("he")}>
              <span className={lang === "he" ? "font-semibold text-primary" : ""}>עברית</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};