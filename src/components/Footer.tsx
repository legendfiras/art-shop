import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/contact">Contact</Link>
      <Link to="/contact">@letsshopart</Link>
    </footer>
  );
}
