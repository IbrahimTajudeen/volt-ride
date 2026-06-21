import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Award, Leaf, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-ev.jpg";

const About = () => (
  <Layout>
    <section className="container-px mx-auto max-w-7xl py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Our Story</p>
        <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight">Electric mobility, <span className="text-gradient">obsessively crafted.</span></h1>
        <p className="mt-6 text-lg text-muted-foreground">Founded in 2019 by a team of engineers and riders, Voltride exists to make premium electric mobility accessible to everyone. We design every component in-house and test every ride on real roads.</p>
        <Link to="/shop"><Button variant="hero" size="lg" className="mt-8">Explore our rides</Button></Link>
      </div>
      <img src={heroImg} alt="Voltride lineup" className="rounded-2xl shadow-elevated" />
    </section>
    <section className="container-px mx-auto max-w-7xl py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: Users, n: "120K+", l: "Riders worldwide" },
        { icon: Zap, n: "8M+", l: "Electric miles" },
        { icon: Leaf, n: "2,400t", l: "CO₂ saved / year" },
        { icon: Award, n: "37", l: "Design awards" },
      ].map((s, i) => (
        <div key={i} className="card-surface rounded-2xl p-6 text-center">
          <s.icon className="h-6 w-6 text-primary mx-auto mb-3" />
          <div className="font-display text-3xl font-bold text-gradient">{s.n}</div>
          <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
        </div>
      ))}
    </section>
  </Layout>
);

export default About;
