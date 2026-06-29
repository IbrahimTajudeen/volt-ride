import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Headphones, Mail, MessageSquare, Phone, BookOpen, LifeBuoy } from "lucide-react";

const Support = () => (
  <Layout>
    <section className="container-px mx-auto max-w-5xl py-16">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">We're here for you</p>
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Help & Support</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Browse self-serve guides or reach a real human — our riders' care team replies in under 2 hours on weekdays.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          { icon: Phone, title: "Call us", text: "+1 (800) 555-VOLT", href: "tel:+18005558658" },
          { icon: Mail, title: "Email", text: "support@voltride.com", href: "mailto:support@voltride.com" },
          { icon: MessageSquare, title: "Live chat", text: "Available 8 AM – 9 PM", href: "/contact" },
        ].map((s, i) => (
          <a key={i} href={s.href} className="card-surface rounded-2xl p-6 hover-lift">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><s.icon className="h-5 w-5 text-primary" /></div>
            <div className="font-display font-semibold">{s.title}</div>
            <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
          </a>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {[
          { icon: BookOpen, title: "FAQs", text: "Quick answers to the most common questions.", to: "/faqs" },
          { icon: LifeBuoy, title: "Track an order", text: "Real-time delivery updates by order number.", to: "/track-order" },
          { icon: Headphones, title: "Returns", text: "Start a 30-day return in two clicks.", to: "/returns" },
          { icon: BookOpen, title: "Shipping info", text: "Delivery windows, fees, and international rules.", to: "/shipping" },
        ].map((s, i) => (
          <Link key={i} to={s.to} className="card-surface rounded-2xl p-6 flex gap-4 hover-lift">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><s.icon className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="font-display font-semibold">{s.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </Layout>
);

export default Support;