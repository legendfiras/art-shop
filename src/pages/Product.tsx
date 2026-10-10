import { type FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { money } from "../components/ProductCard";
import { useStore } from "../store";

export function ProductPage() {
  const { id } = useParams();
  const { products, artists, addToCart } = useStore();
  const product = products.find((entry) => entry.id === id);
  const artist = artists.find((entry) => entry.id === product?.artistId);
  const [size, setSize] = useState(product?.sizes?.[0] ?? "");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="page">
        <h1>That piece is gone.</h1>
        <Link to="/shop">Back to the shop</Link>
      </main>
    );
  }

  const listing = product;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    addToCart(listing.id, size || undefined);
    setAdded(true);
  }

  return (
    <main className="page product-page">
      <div className="product-plate">
        {listing.image ? <img src={listing.image} alt="" /> : null}
        {listing.salePattern ? <img className="sale-pattern" src="/assets/sale-pattern.svg" alt="" /> : null}
      </div>
      <div>
        <p className="kicker">{listing.category}</p>
        <h1>{listing.title}</h1>
        {artist ? (
          <p>
            by <Link to={`/artists/${artist.id}`}>{artist.name}</Link>
          </p>
        ) : (
          <p>by {listing.maker ?? "a designer on lets shop art"}</p>
        )}
        <p className="price price-large">
          {listing.compareAt ? <s>{money(listing.compareAt)}</s> : null}
          <span>{money(listing.price)}</span>
        </p>
        <p>{listing.description}</p>
        <form onSubmit={onSubmit} className="buy-form">
          {listing.sizes ? (
            <fieldset>
              <legend>size</legend>
              <div className="size-row size-row-dark">
                {listing.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={size === option ? "is-on" : ""}
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}
          <button className="account-pill" type="submit">
            add to cart
          </button>
          {added ? <p className="confirm">Added. It is waiting in the cart.</p> : null}
        </form>
      </div>
    </main>
  );
}
