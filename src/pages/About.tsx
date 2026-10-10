import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <main className="page about">
      <header className="page-head">
        <h1>about</h1>
        <p>You’ve just arrived at the all-local, all-human art purchasing website.</p>
      </header>
      <div className="prose">
        <p>lets shop art is a marketplace for graphic designers. They post the work. People who want it buy it.</p>
        <p>Apparel, prints, stickers, and the other things that come out of a studio. The point is to pay the person who made the piece.</p>
        <p className="hero-note">*none of that AI-generated sh!t.</p>
        <p>
          Designers open an art account, list a piece, and set a price. Buyers filter the shop, add work to a cart, and place an order.
          The artist confirms it. This shop keeps the listing, the cart, and the order on this device so the catalog can be edited without a server.
        </p>
        <Link to="/account" className="account-pill">
          setupure art account
        </Link>
      </div>
    </main>
  );
}
