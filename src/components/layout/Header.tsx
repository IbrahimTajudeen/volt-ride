import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, Sun, Moon, X, Bell, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/store/cart";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navLeft = [
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/blog", label: "Blog" },
];
const navRight = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faqs", label: "FAQs" },
];

export const Header = () => {
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false)
      .then(({ count }) => setUnread(count || 0));
  }, [user]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container-px mx-auto max-w-7xl grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-4">
        <nav className="hidden lg:flex items-center gap-1 justify-start">
          {navLeft.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="flex items-center justify-center gap-2 group">
          <img
            src="/volt-ride-logo.png"
            alt="Volt Ride logo"
            loading="lazy"
            width={800}
            height={800}
            className="relative h-20 w-20 bg-transparent"
          />
          <span className="font-display text-xl sm:text-2xl font-bold tracking-[0.18em] uppercase">
            Volt<span className="text-primary">ride</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 justify-end">
          <nav className="hidden xl:flex items-center gap-1 mr-2">
            {navRight.map((n) => (
              <NavLink key={n.to} to={n.to} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggle}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {user && (
            <Link to="/notifications" className="relative">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              {unread > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/account")}>
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/notifications")}>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => nav("/admin")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
          )}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
        <div className="lg:hidden flex justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/60 bg-background animate-fade-in">
          <div className="container-px mx-auto max-w-7xl py-3 flex flex-col">
            {[...navLeft, ...navRight].map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-border/40 last:border-0"
              >
                {n.label}
              </NavLink>
            ))}
            {!user && (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold text-primary"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};