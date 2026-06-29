import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, Category, Product } from "@/data/products";
import { fetchProducts } from "@/lib/productsApi";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const Shop = () => {
  const { category } = useParams<{ category?: string }>();
  const [active, setActive] = useState<Category | "all">((category as Category) || "all");
  const [sort, setSort] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts().then((p) => { setProducts(p); setLoading(false); }); }, []);
  useEffect(() => { if (category) setActive(category as Category); }, [category]);

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter(p => p.category === active);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [active, sort, products]);


  const title = active === "all" ? "All Products" : categories.find(c => c.id === active)?.name || "Shop";

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl pt-12 pb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Shop</p>
        <h1 className="font-display text-4xl lg:text-5xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} products</p>
      </section>

      {/* Mobile filter bar */}
      <section className="container-px mx-auto max-w-7xl pb-4 lg:hidden grid grid-cols-2 gap-3">
        <Select value={active} onValueChange={(v) => setActive(v as Category | "all")}>
          <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="container-px mx-auto max-w-7xl pb-20 lg:grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block space-y-6">
          <div>
            <h3 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Category</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActive("all")}
                className={`text-left text-sm px-3 py-2 rounded-md transition-colors ${active==="all" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                All Products
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setActive(c.id)}
                  className={`text-left text-sm px-3 py-2 rounded-md transition-colors ${active===c.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="hidden lg:flex justify-end mb-6">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
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