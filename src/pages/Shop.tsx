import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products, categories, Category } from "@/data/products";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const { category } = useParams<{ category?: string }>();
  const [active, setActive] = useState<Category | "all">((category as Category) || "all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter(p => p.category === active);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [active, sort]);

  const title = active === "all" ? "All Products" : categories.find(c => c.id === active)?.name || "Shop";

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl pt-12 pb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Shop</p>
        <h1 className="font-display text-4xl lg:text-5xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} products</p>
      </section>

      <section className="container-px mx-auto max-w-7xl pb-20 grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-6">
          <div>
            <h3 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Category</h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto">
              <button onClick={() => setActive("all")}
                className={`text-left text-sm px-3 py-2 rounded-md whitespace-nowrap transition-colors ${active==="all" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                All Products
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setActive(c.id)}
                  className={`text-left text-sm px-3 py-2 rounded-md whitespace-nowrap transition-colors ${active===c.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex justify-end mb-6">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="h-10 px-3 rounded-md bg-secondary border border-border text-sm">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found.</p>
              <Button variant="outline" className="mt-4" onClick={() => setActive("all")}>Reset filters</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
