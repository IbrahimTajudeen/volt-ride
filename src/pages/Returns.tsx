import { Layout } from "@/components/layout/Layout";
import { RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Returns = () => (
  <Layout>
    <section className="container-px mx-auto max-w-4xl py-16">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">30-day promise</p>
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Returns & Refunds</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Not in love with your ride? Send it back within 30 days for a full refund — no questions asked.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          { icon: RotateCcw, title: "Free returns", text: "Prepaid label included with every order over $99." },
          { icon: CheckCircle2, title: "Fast refunds", text: "Refunds issued within 3–5 business days of receipt." },
          { icon: AlertTriangle, title: "Conditions", text: "Items must be unused, in original packaging, and free of damage." },
        ].map((s, i) => (
          <div key={i} className="card-surface rounded-2xl p-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><s.icon className="h-5 w-5 text-primary" /></div>
            <div className="font-display font-semibold">{s.title}</div>
            <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="card-surface rounded-2xl p-6 mt-6">
        <h3 className="font-display font-semibold mb-2">How to start a return</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Open your order from the Account → Orders page.</li>
          <li>Select "Request return" and choose a reason.</li>
          <li>Print the prepaid label we email you and drop the package at any carrier.</li>
        </ol>
        <Link to="/account#orders"><Button variant="hero" className="mt-5">Go to my orders</Button></Link>
      </div>
    </section>
  </Layout>
);

export default Returns;