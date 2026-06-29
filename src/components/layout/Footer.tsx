import { Link } from "react-router-dom";
import { Zap, Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="section-dark border-t border-border/60 mt-24">
      <div className="container-px mx-auto max-w-7xl py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          {/* <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary fill-primary" />
            <span className="font-display text-xl font-bold">VOLTRIDE</span>
          </div> */}
          <div className="flex items-center gap-2 mb-4">
          <img
              src="/volt-ride-logo.png"
              alt="Volt Ride logo"
              loading="lazy"
              width={800}
              height={800}
              className="relative h-10 w-10 text-primary bg-transparent"
            />
          <span className="font-display text-xl font-bold">VOLT<span className="text-primary">RIDE</span></span>
        </div>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">{t("footer.tagline")}</p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">{t("footer.shop")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/categories/bikes" className="hover:text-primary">{t("footer.bikes")}</Link></li>
            <li><Link to="/categories/scooters" className="hover:text-primary">{t("footer.scooters")}</Link></li>
            <li><Link to="/categories/batteries" className="hover:text-primary">{t("footer.batteries")}</Link></li>
            <li><Link to="/categories/chargers" className="hover:text-primary">{t("footer.chargers")}</Link></li>
            <li><Link to="/categories/parts" className="hover:text-primary">{t("footer.parts")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">{t("footer.company")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">{t("nav.about")}</Link></li>
            <li><Link to="/blog" className="hover:text-primary">{t("nav.blog")}</Link></li>
            <li><Link to="/faqs" className="hover:text-primary">{t("nav.faqs")}</Link></li>
            <li><Link to="/contact" className="hover:text-primary">{t("nav.contact")}</Link></li>
            <li><Link to="/track-order" className="hover:text-primary">{t("track.title")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">{t("footer.getInTouch")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Mail className="h-4 w-4 text-primary shrink-0" /> hello@voltride.com</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /> +1 (800) 555-0142</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-primary shrink-0" /> 240 Mission St, San Francisco</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-px mx-auto max-w-7xl py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Voltride Mobility, Inc. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-foreground">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};