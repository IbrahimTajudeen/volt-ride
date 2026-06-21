import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Image } from "@radix-ui/react-avatar";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container-px mx-auto max-w-7xl flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
            <img
              src="volt-ride-logo.png"
              alt="Volt Ride logo"
              loading="lazy"
              width={800}
              height={800}
              className="relative h-10 w-10 text-primary bg-transparent"
            />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            VOLTRIDE
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/account">
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
          </Link>
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
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border/60 bg-background animate-fade-in">
          <div className="container-px mx-auto max-w-7xl py-3 flex flex-col">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-border/40 last:border-0"
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
