import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, Sun, Moon, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container-px mx-auto max-w-7xl grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-4">
        {/* Left nav */}
        <nav className="hidden lg:flex items-center gap-1 justify-start">
          {navLeft.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile: menu button (left) */}
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

        {/* Centered brand */}
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

        {/* Right nav + actions */}
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
          <Link to="/account" className="hidden sm:inline-flex">
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
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium"
            >
              Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};