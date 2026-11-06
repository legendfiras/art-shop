import { Link } from "react-router-dom";
import type { Product } from "../types";

const stamps = {
  burst: "/assets/stamp-burst.svg",
  hex: "/assets/stamp-hex.svg",
  bar: "/assets/stamp-bar.svg",
  circle: "/assets/stamp-circle.svg",
};

export function money(value: number) {
  return `$${value}`;
}

export function ProductCard({
  product,
  showTitle = false,
}: {
  product: Product;
  showTitle?: boolean;
}) {
  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="plate">
          {product.image ? <img className="plate-art" src={product.image} alt={product.title} /> : null}
          {product.salePattern && !product.image ? <img className="sale-pattern" src="/assets/sale-pattern.svg" alt="" /> : null}
          <img className={`stamp stamp-${product.stamp}`} src={stamps[product.stamp]} alt="" />
        </div>
        <p className="price">
          {product.compareAt ? <s>{money(product.compareAt)}</s> : null}
          <span>{money(product.price)}</span>
        </p>
        {showTitle ? <p className="card-title">{product.title}</p> : <span className="sr-only">{product.title}</span>}
      </Link>
    </article>
  );
}
