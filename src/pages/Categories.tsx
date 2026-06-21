import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { categories, byCategory } from "@/data/products";

const Categories = () => (
  <Layout>
    <section className="container-px mx-auto max-w-7xl py-12">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Browse</p>
      <h1 className="font-display text-4xl lg:text-5xl font-bold">All Categories</h1>
      <p className="text-muted-foreground mt-2 max-w-xl">From flagship rides to spare parts — find exactly what you need.</p>
    </section>
    <section className="container-px mx-auto max-w-7xl pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(c => (
        <Link key={c.id} to={`/categories/${c.id}`} className="group card-surface rounded-2xl overflow-hidden hover-lift">
          <div className="aspect-[4/3] bg-black overflow-hidden">
            <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">{c.name}</h3>
              <p className="text-sm text-muted-foreground">{byCategory(c.id).length}+ products</p>
            </div>
            <span className="text-primary">→</span>
          </div>
        </Link>
      ))}
    </section>
  </Layout>
);

export default Categories;
