import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="logo" aria-label="lets shop art">
        <img src="/assets/logo-footer.svg" alt="" />
      </Link>
      <Link to="/contact">Contact</Link>
      <Link to="/contact">@letsshopart</Link>
    </footer>
  );
}
