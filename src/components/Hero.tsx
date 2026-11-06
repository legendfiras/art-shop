import { type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../types";

const blobs = [
  { category: "apparel", src: "/assets/blob-apparel.svg", className: "blob-apparel", label: "apparel" },
  { category: "print", src: "/assets/blob-print.svg", className: "blob-print", label: "print" },
  { category: "stickers", src: "/assets/blob-stickers.svg", className: "blob-stickers", label: "stickers" },
  { category: "other", src: "/assets/blob-other.svg", className: "blob-other", label: "other" },
] as const;

export function Hero() {
  return (
    <section className="hero">
      <img className="hero-wash" src="/assets/hero-wash.png" alt="" />
      <div className="hero-copy">
        <p>You’ve just arrived at the all-local,</p>
        <p>all-human art purchasing website.</p>
        <p>Be the support this community needs</p>
        <p className="hero-note">*none of that AI-generated sh!t.</p>
      </div>
      <div className="blobs">
        {blobs.map((blob) => (
          <Link key={blob.category} to={`/shop?category=${blob.category}`} className={blob.className}>
            <img src={blob.src} alt="" />
            <span>{blob.label}</span>
          </Link>
        ))}
        <video
          className="hero-jump"
          src="/assets/artwork.webm?v=2"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

export function SearchBar({ initial = "" }: { initial?: string }) {
  const navigate = useNavigate();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const q = String(data.get("q") ?? "").trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <form className="search" onSubmit={onSubmit} role="search">
      <label className="sr-only" htmlFor="shop-search">
        Search the shop
      </label>
      <input id="shop-search" name="q" defaultValue={initial} />
      <button type="submit" aria-label="Search">
        <img src="/assets/icon-search-ring.svg" alt="" className="search-ring" />
        <img src="/assets/icon-search-user.svg" alt="" className="search-user" />
      </button>
    </form>
  );
}

export function categoryLabel(category: string) {
  return categories.find((entry) => entry === category) ?? category;
}
