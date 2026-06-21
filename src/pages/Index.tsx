import { Link } from "react-router-dom";
import { ArrowRight, Battery, Truck, ShieldCheck, Lock, Zap, Star, CheckCircle2, Clock } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";
import heroImg from "@/assets/hero-ev.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } },
};


const benefits = [
  { icon: Battery, title: "Long Battery Life", text: "Up to 120 km on a single charge" },
  { icon: Truck, title: "Fast Delivery", text: "Free shipping in 2–4 days" },
  { icon: ShieldCheck, title: "3-Year Warranty", text: "Full coverage on motor & battery" },
  { icon: Lock, title: "Secure Payments", text: "256-bit encrypted checkout" },
];

const reviews = [
  { name: "Maya R.", role: "City Commuter", text: "The X1 Pro turned my 45-min commute into a 20-min joyride. Build quality is insane.", rating: 5 },
  { name: "James K.", role: "Trail Rider", text: "Trail E9 handles rocky climbs like nothing else. Battery still has 40% after a 3-hour ride.", rating: 5 },
  { name: "Priya S.", role: "Verified Owner", text: "Support team replaced a damaged charger the next day. That's premium service.", rating: 5 },
];

const Index = () => {
  const bestSellers = products.filter(p => p.badge === "Best Seller").slice(0, 4);
  const newArrivals = products.filter(p => p.badge === "New").slice(0, 4);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        <motion.div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 30%, hsl(25 100% 50% / 0.3), transparent 40%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.4, ease }}
        />
        <motion.div
          className="relative container-px mx-auto max-w-7xl pt-16 pb-20 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div>
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6"
            >
              <Zap className="h-3 w-3 fill-primary" /> New 2026 Lineup Available
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight"
            >
              Ride the <span className="text-gradient">Future.</span>
              <br />Premium Electric <br className="hidden sm:block" />
              Bikes & Scooters.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-muted-foreground max-w-lg">
              Engineered for the city and beyond. Up to 120 km range, instant torque, and zero emissions — delivered to your door.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/categories/bikes">
                <Button variant="hero" size="xl">Shop Bikes <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/categories/scooters">
                <Button variant="outlineGlow" size="xl">Shop Scooters</Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <span className="font-semibold">4.9</span>
                <span className="text-muted-foreground">/ 12,400+ reviews</span>
              </div>
            </motion.div>
          </div>
          <motion.div
            variants={scaleIn}
            className="relative"
          >
            <motion.div
              className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <img
              src={heroImg}
              alt="Premium electric scooter and bike"
              width={1920}
              height={1200}
              className="relative w-full h-auto rounded-2xl shadow-elevated"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease }}
              className="absolute -bottom-4 -left-4 card-surface rounded-xl px-4 py-3 flex items-center gap-3 shadow-elevated hidden sm:flex"
            >
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Battery className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Range</div>
                <div className="font-display font-bold">120 km</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease }}
              className="absolute -top-4 -right-4 card-surface rounded-xl px-4 py-3 flex items-center gap-3 shadow-elevated hidden sm:flex"
            >
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Charge</div>
                <div className="font-display font-bold">4.5 hrs</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* BENEFITS */}
      <section className="border-y border-border/60 bg-surface/40">
        <motion.div
          className="container-px mx-auto max-w-7xl py-10 grid grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {benefits.map((b, i) => (
            <motion.div key={i} variants={fadeUp} className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">

                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-display font-semibold">{b.title}</div>
                <div className="text-xs text-muted-foreground">{b.text}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Explore</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold">Featured Categories</h2>
          </div>
          <Link to="/categories" className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-primary">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link key={c.id} to={`/categories/${c.id}`}
              className="group card-surface rounded-2xl overflow-hidden hover-lift">
              <div className="aspect-square bg-black overflow-hidden">
                <img src={c.image} alt={c.name} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-sm">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Top picks</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold">Best Selling Products</h2>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-primary">
            Shop all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="relative overflow-hidden rounded-3xl card-surface p-10 lg:p-16">
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Spring Drop</p>
              <h3 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
                Save up to <span className="text-gradient">$400</span> on 2026 models.
              </h3>
              <p className="mt-4 text-muted-foreground max-w-md">Limited stock. Free delivery, free helmet, and 0% APR financing on all flagship rides.</p>
              <Link to="/shop"><Button variant="hero" size="lg" className="mt-6">Shop the Sale <ArrowRight /></Button></Link>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[{n:"120K+",l:"Happy riders"},{n:"3 yr",l:"Warranty"},{n:"24/7",l:"Support"}].map((s,i)=>(
                <div key={i} className="card-surface rounded-xl p-4">
                  <div className="font-display text-2xl lg:text-3xl font-bold text-gradient">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-px mx-auto max-w-7xl py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Just landed</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold">New Arrivals</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Why Voltride</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight">Built different. <br />Engineered to last.</h2>
            <p className="mt-4 text-muted-foreground">Every Voltride is hand-assembled, road-tested, and backed by industry-leading aftercare. We obsess over the details so you can ride with confidence.</p>
            <ul className="mt-8 space-y-4">
              {[
                "Aerospace-grade aluminum frames",
                "Smart BMS with thermal protection",
                "OTA firmware updates for life",
                "Free lifetime tech support",
              ].map((f, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.slice(0, 4).map((c) => (
              <div key={c.id} className="card-surface rounded-2xl overflow-hidden aspect-square">
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Loved by riders</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold">12,400+ five-star reviews</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="card-surface rounded-2xl p-6">
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-foreground/90 mb-6 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="card-surface rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-40" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">Get $50 off your first ride</h2>
            <p className="mt-3 text-muted-foreground">Join 80,000+ riders. Be first to hear about new drops, restocks, and rider-only deals.</p>
            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@email.com"
                required
                className="flex-1 h-12 px-4 rounded-md bg-background border border-border focus:border-primary focus:outline-none"
              />
              <Button variant="hero" size="lg" type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
