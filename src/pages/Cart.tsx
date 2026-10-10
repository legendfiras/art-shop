import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { money } from "../components/ProductCard";
import { useStore } from "../store";

export function CartPage() {
  const { cart, products, setQty, removeFromCart, placeOrder, user } = useStore();
  const [placed, setPlaced] = useState<string | null>(null);

  const lines = cart
    .map((item) => ({ item, product: products.find((entry) => entry.id === item.productId) }))
    .filter((line) => line.product);
  const total = lines.reduce((sum, line) => sum + line.product!.price * line.item.qty, 0);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const order = placeOrder({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      city: String(data.get("city") ?? ""),
      note: String(data.get("note") ?? ""),
    });
    if (order) setPlaced(order.id);
  }

  return (
    <main className="page">
      <header className="page-head">
        <h1>cart</h1>
      </header>
      {lines.length === 0 && !placed ? (
        <p className="empty-note">
          The cart is empty. <Link to="/shop">Browse the shop.</Link>
        </p>
      ) : null}
      <ul className="cart-list">
        {lines.map(({ item, product }) => (
          <li key={`${item.productId}-${item.size ?? ""}`}>
            <Link to={`/product/${product!.id}`}>{product!.title}</Link>
            <span>{item.size}</span>
            <span>{money(product!.price)}</span>
            <label>
              qty
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(event) => setQty(item.productId, Number(event.target.value), item.size)}
              />
            </label>
            <button type="button" onClick={() => removeFromCart(item.productId, item.size)}>
              remove
            </button>
          </li>
        ))}
      </ul>
      {lines.length > 0 ? (
        <>
          <p className="total">total {money(total)}</p>
          {user ? (
            <form className="stack-form" onSubmit={onSubmit}>
              <h2>place order</h2>
              <p>The artist confirms the order. No card is taken on this site.</p>
              <label>
                name
                <input name="name" defaultValue={user.name} required />
              </label>
              <label>
                email
                <input name="email" type="email" defaultValue={user.email} required />
              </label>
              <label>
                city
                <input name="city" required />
              </label>
              <label>
                note
                <textarea name="note" rows={3} />
              </label>
              <button className="account-pill" type="submit">
                place order
              </button>
            </form>
          ) : (
            <p>
              <Link to="/signin?next=/cart">Sign in</Link> to place the order.
            </p>
          )}
        </>
      ) : null}
      {placed ? <p className="confirm">Order placed. The artists on the list can follow up from here.</p> : null}
    </main>
  );
}
