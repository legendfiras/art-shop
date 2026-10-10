import { Link } from "react-router-dom";
import { Catalog, useCatalogState } from "../components/Catalog";
import { FiltersPanel } from "../components/Filters";
import { Hero, SearchBar } from "../components/Hero";
import { useStore } from "../store";

export function HomePage() {
  const { products } = useStore();
  const featured = products.filter((product) => product.featured);
  const { filters, setFilters, filtered, active } = useCatalogState(featured);

  return (
    <main>
      <Hero />
      <div className="rule" />
      <div className="home-tools">
        <Link to="/account" className="account-pill">
          setupure art account
        </Link>
        <SearchBar />
      </div>
      <section className="catalog">
        <FiltersPanel filters={filters} onChange={setFilters} />
        <Catalog products={active ? filtered : featured} clip={!active} />
      </section>
    </main>
  );
}
