import { Layout } from "@/components/layout/Layout";
import { Truck, Globe, Package, Clock } from "lucide-react";

const Shipping = () => (
  <Layout>
    <section className="container-px mx-auto max-w-4xl py-16">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Voltride Logistics</p>
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Shipping & Delivery</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Fast, insured delivery on every order. Track your ride from the warehouse to your driveway.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-10">
        {[
          { icon: Truck, title: "Standard delivery", text: "Free on orders over $99. Arrives in 2–4 business days." },
          { icon: Clock, title: "Express", title2: "Express", text: "Next-day delivery available in major metros for $29." },
          { icon: Globe, title: "International", text: "We ship to 40+ countries. Duties calculated at checkout." },
          { icon: Package, title: "Large items", text: "Bikes and scooters ship in protective crates with white-glove unboxing options." },
        ].map((s, i) => (
          <div key={i} className="card-surface rounded-2xl p-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><s.icon className="h-5 w-5 text-primary" /></div>
            <div className="font-display font-semibold">{s.title}</div>
            <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="card-surface rounded-2xl p-6 mt-6 text-sm leading-relaxed text-muted-foreground">
        Orders placed before 2 PM local time ship the same day. You'll receive a tracking link via email and in your account
        notifications once your order is on the move. For lost or delayed shipments, contact our support team within 14 days
        of the expected arrival.
      </div>
    </section>
  </Layout>
);

export default Shipping;