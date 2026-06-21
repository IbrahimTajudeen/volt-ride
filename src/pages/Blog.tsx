import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import bike from "@/assets/cat-bike.jpg";
import scooter from "@/assets/cat-scooter.jpg";
import battery from "@/assets/cat-battery.jpg";

const posts = [
  { slug: "x1-pro-review", title: "The X1 Pro: First Ride Review", excerpt: "We took our flagship scooter through 200 km of San Francisco hills. Here's what stood out.", date: "Jun 18, 2026", img: scooter, tag: "Reviews" },
  { slug: "battery-care", title: "5 Habits for Longer Battery Life", excerpt: "Simple charging routines that extend your battery's lifespan by up to 40%.", date: "Jun 12, 2026", img: battery, tag: "Tips" },
  { slug: "trail-e9-launch", title: "Introducing the Trail E9", excerpt: "All-terrain. All-day. Meet the e-bike built for everything off the pavement.", date: "Jun 1, 2026", img: bike, tag: "News" },
];

const Blog = () => (
  <Layout>
    <section className="container-px mx-auto max-w-7xl py-16">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Stories & News</p>
      <h1 className="font-display text-5xl font-bold">The Voltride Journal</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">Reviews, tips, and the road ahead in electric mobility.</p>
    </section>
    <section className="container-px mx-auto max-w-7xl pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(p => (
        <Link key={p.slug} to="#" className="card-surface rounded-2xl overflow-hidden hover-lift group">
          <div className="aspect-[4/3] overflow-hidden bg-black">
            <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">{p.tag}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
            </div>
            <h3 className="font-display font-bold text-xl group-hover:text-primary transition-colors">{p.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>
          </div>
        </Link>
      ))}
    </section>
  </Layout>
);

export default Blog;
