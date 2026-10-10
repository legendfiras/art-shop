import { useSearchParams } from "react-router-dom";
import { Catalog, useCatalogState } from "../components/Catalog";
import { FiltersPanel } from "../components/Filters";
import { SearchBar } from "../components/Hero";
import { useStore } from "../store";

function ShopBrowser() {
  const { products } = useStore();
  const [params] = useSearchParams();
  const { filters, setFilters, filtered, query } = useCatalogState(products);
  const category = params.get("category");

  return (
    <main className="page">
      <header className="page-head">
        <h1>{category ?? "shop"}</h1>
        <p>Work from graphic designers. Apparel, prints, stickers, and the things that do not fit a shelf.</p>
      </header>
      <SearchBar key={query} initial={query} />
      <section className="catalog">
        <FiltersPanel filters={filters} onChange={setFilters} />
        <Catalog products={filtered} showTitle />
      </section>
    </main>
  );
}

export function ShopPage() {
  const [params] = useSearchParams();
  return <ShopBrowser key={params.toString()} />;
}
