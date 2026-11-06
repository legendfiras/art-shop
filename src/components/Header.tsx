import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { categories } from "../types";
import { useStore } from "../store";

export function Header({ overlay }: { overlay?: boolean }) {
  const { user, cart } = useStore();
  const location = useLocation();
  const [open, setOpen] = useState(Boolean(overlay));
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1200px)");
    const sync = () => setOpen(Boolean(overlay) && media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [overlay, location.pathname]);

  return (
    <header className={overlay ? "topbar topbar-overlay" : "topbar"}>
      <Link to="/" className="logo" aria-label="lets shop art">
        <img src="/assets/logo.svg" alt="" />
      </Link>
      <nav className="nav" aria-label="Primary">
        <NavLink to="/about">about</NavLink>
        <div
          className={open ? "shop-link is-open" : "shop-link"}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(Boolean(overlay) && window.matchMedia("(min-width: 1200px)").matches)}
        >
          <NavLink to="/shop" className="nav-button">
            shop
          </NavLink>
          <div className="shop-drop" role="menu">
            {categories.map((category) => (
              <Link key={category} to={`/shop?category=${category}`} role="menuitem">
                {category}
              </Link>
            ))}
          </div>
        </div>
        <NavLink to="/artists">artists</NavLink>
        {user ? (
          <NavLink to="/account">{user.name.split(" ")[0]}</NavLink>
        ) : (
          <NavLink to="/signin">Sign in</NavLink>
        )}
      </nav>
      <div className="tools">
        <Link to={user ? "/account" : "/signin"} className="tool" aria-label={user ? "Account" : "Sign in"}>
          <img src="/assets/icon-user-ring.svg" alt="" className="tool-ring" />
          <img src="/assets/icon-user.svg" alt="" className="tool-user" />
        </Link>
        <Link to="/cart" className="tool tool-cart" aria-label={`Cart, ${count} items`}>
          <img src="/assets/icon-cart.svg" alt="" />
          {count > 0 ? <span className="cart-count">{count}</span> : null}
        </Link>
      </div>
    </header>
  );
}
