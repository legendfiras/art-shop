import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../store";

export function ArtistPage() {
  const { id } = useParams();
  const { artists, products, user } = useStore();
  const artist = artists.find((entry) => entry.id === id);
  const listings = products.filter((product) => product.artistId === id);
  const own = user?.id === id;

  if (!artist && !own) {
    return (
      <main className="page">
        <h1>No artist by that name.</h1>
        <Link to="/artists">All artists</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-head">
        <h1>{artist?.name ?? user?.name}</h1>
        <p>{artist ? `${artist.city}. ${artist.bio}` : "Listings posted from your art account."}</p>
      </header>
      <div className="catalog-grid catalog-grid-solo">
        {listings.map((product) => (
          <ProductCard key={product.id} product={product} showTitle />
        ))}
      </div>
      {listings.length === 0 ? <p className="empty-note">No listings yet.</p> : null}
    </main>
  );
}
