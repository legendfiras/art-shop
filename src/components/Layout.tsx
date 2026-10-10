import { Outlet, useMatch } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout() {
  const home = useMatch("/");
  return (
    <div className={home ? "shell shell-home" : "shell"}>
      <Header overlay={Boolean(home)} />
      <Outlet />
      <Footer />
    </div>
  );
}
