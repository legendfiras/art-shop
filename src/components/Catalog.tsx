import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { emptyFilters, type Category, type Filters, type Product } from "../types";
import { ProductCard } from "./ProductCard";

function readFilters(params: URLSearchParams): Filters {
  const category = params.get("category");
  return {
    ...emptyFilters,
    categories: category ? [category as Category] : [],
  };
}

export function applyFilters(products: Product[], filters: Filters, query: string) {
  const min = filters.min === "" ? null : Number(filters.min);
  const max = filters.max === "" ? null : Number(filters.max);
  const needle = query.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
    if (min !== null && !Number.isNaN(min) && product.price < min) return false;
    if (max !== null && !Number.isNaN(max) && product.price > max) return false;
    if (filters.sizes.length > 0) {
      const sizes = product.sizes ?? [];
      if (!filters.sizes.some((size) => sizes.includes(size))) return false;
    }
    if (needle && !`${product.title} ${product.category}`.toLowerCase().includes(needle)) return false;
    return true;
  });
}

export function Catalog({
  products,
  clip = false,
  showTitle = false,
}: {
  products: Product[];
  clip?: boolean;
  showTitle?: boolean;
}) {
  const visible = clip ? products.slice(0, 12) : products;
  const clipped = clip ? products.slice(12, 16) : [];

  return (
    <div className="catalog-grid">
      {visible.length === 0 ? <p className="empty-note">Nothing in the shop matches those filters.</p> : null}
      {visible.map((product, index) => (
        <ProductCard key={product.id} product={product} showTitle={showTitle} />
      ))}
      {clipped.length > 0 ? (
        <div className="row-clip">
          {clipped.map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function useCatalogState(products: Product[]) {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => readFilters(params));
  const query = params.get("q") ?? "";
  const filtered = useMemo(() => applyFilters(products, filters, query), [products, filters, query]);
  const active =
    filters.min !== "" || filters.max !== "" || filters.categories.length > 0 || filters.sizes.length > 0 || query !== "";
  return { filters, setFilters, filtered, active, query };
}
