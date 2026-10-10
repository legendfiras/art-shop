import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { money } from "../components/ProductCard";
import { useStore } from "../store";
import { apparelSizes, categories, type Category, type Product, type Stamp } from "../types";

const stamps: Stamp[] = ["burst", "hex", "bar", "circle"];

const blank = {
  id: "",
  title: "",
  category: "print" as Category,
  price: "",
  compareAt: "",
  description: "",
  sizes: [] as string[],
  image: "" as string,
};

export function AccountPage() {
  const { user, products, orders, saveProduct, deleteProduct, signOut, becomeDesigner } = useStore();
  const [draft, setDraft] = useState(blank);
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return <Navigate to="/signin?next=/account" replace />;

  const mine = products.filter((product) => product.artistId === user.id);
  const mineOrders = orders.filter((order) => order.userId === user.id);

  function edit(product: Product) {
    setDraft({
      id: product.id,
      title: product.title,
      category: product.category,
      price: String(product.price),
      compareAt: product.compareAt ? String(product.compareAt) : "",
      description: product.description,
      sizes: product.sizes ?? [],
      image: product.image ?? "",
    });
    setMessage(null);
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 900_000) {
      setMessage("Use an image under 900KB. It is stored in this browser.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, image: String(reader.result ?? "") }));
    reader.readAsDataURL(file);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const price = Number(draft.price);
    const compareAt = draft.compareAt === "" ? undefined : Number(draft.compareAt);
    if (!draft.title.trim() || Number.isNaN(price) || price < 0) {
      setMessage("Add a title and a price.");
      return;
    }
    const index = mine.findIndex((product) => product.id === draft.id);
    const stamp = stamps[(index === -1 ? mine.length : index) % stamps.length];
    const product: Product = {
      id: draft.id || crypto.randomUUID(),
      title: draft.title.trim(),
      artistId: user!.id,
      maker: user!.name,
      category: draft.category,
      price,
      compareAt: compareAt && !Number.isNaN(compareAt) ? compareAt : undefined,
      stamp,
      salePattern: stamp === "hex",
      sizes: draft.category === "apparel" ? (draft.sizes.length ? draft.sizes : apparelSizes) : undefined,
      description: draft.description.trim() || "A piece posted from an art account.",
      image: draft.image || undefined,
    };
    saveProduct(product);
    setDraft(blank);
    setMessage(draft.id ? "Listing updated." : "Listing posted. It is in the shop.");
  }

  return (
    <main className="page account">
      <header className="page-head">
        <h1>setupure art account</h1>
        <p>
          {user.name} · {user.email} · {user.role === "designer" ? "designer" : "collector"}
        </p>
      </header>

      {user.role === "collector" ? (
        <button type="button" className="account-pill" onClick={becomeDesigner}>
          start selling
        </button>
      ) : (
        <form className="stack-form" onSubmit={onSubmit}>
          <h2>{draft.id ? "edit listing" : "post a piece"}</h2>
          <label>
            title
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
          </label>
          <label>
            category
            <select
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <div className="split">
            <label>
              price
              <input
                inputMode="decimal"
                value={draft.price}
                onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                required
              />
            </label>
            <label>
              was (optional)
              <input
                inputMode="decimal"
                value={draft.compareAt}
                onChange={(event) => setDraft({ ...draft, compareAt: event.target.value })}
              />
            </label>
          </div>
          {draft.category === "apparel" ? (
            <fieldset>
              <legend>apparel sizes</legend>
              <div className="size-row size-row-dark">
                {apparelSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={draft.sizes.includes(size) ? "is-on" : ""}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        sizes: draft.sizes.includes(size)
                          ? draft.sizes.filter((entry) => entry !== size)
                          : [...draft.sizes, size],
                      })
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}
          <label>
            about the piece
            <textarea
              rows={4}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />
          </label>
          <label>
            image
            <input type="file" accept="image/*" onChange={(event) => onFile(event.target.files?.[0])} />
          </label>
          {draft.image ? <img className="upload-preview" src={draft.image} alt="" /> : null}
          {message ? <p className="confirm">{message}</p> : null}
          <button className="account-pill" type="submit">
            {draft.id ? "save listing" : "post listing"}
          </button>
          {draft.id ? (
            <button type="button" className="text-button" onClick={() => setDraft(blank)}>
              cancel edit
            </button>
          ) : null}
        </form>
      )}

      <section>
        <h2>your listings</h2>
        {mine.length === 0 ? <p className="empty-note">Nothing posted yet.</p> : null}
        <ul className="manage-list">
          {mine.map((product) => (
            <li key={product.id}>
              <Link to={`/product/${product.id}`}>{product.title}</Link>
              <span>
                {product.category} · {money(product.price)}
              </span>
              <button type="button" onClick={() => edit(product)}>
                edit
              </button>
              <button type="button" onClick={() => deleteProduct(product.id)}>
                delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>your orders</h2>
        {mineOrders.length === 0 ? <p className="empty-note">No orders yet.</p> : null}
        <ul className="manage-list">
          {mineOrders.map((order) => (
            <li key={order.id}>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span>{money(order.total)}</span>
              <span>{order.items.length} pieces</span>
            </li>
          ))}
        </ul>
      </section>

      <button type="button" className="text-button" onClick={signOut}>
        sign out
      </button>
    </main>
  );
}
