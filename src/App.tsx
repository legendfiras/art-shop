import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/About";
import { AccountPage } from "./pages/Account";
import { ArtistPage } from "./pages/Artist";
import { ArtistsPage } from "./pages/Artists";
import { CartPage } from "./pages/Cart";
import { ContactPage } from "./pages/Contact";
import { HomePage } from "./pages/Home";
import { ProductPage } from "./pages/Product";
import { ShopPage } from "./pages/Shop";
import { SignInPage } from "./pages/SignIn";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="artists" element={<ArtistsPage />} />
        <Route path="artists/:id" element={<ArtistPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
