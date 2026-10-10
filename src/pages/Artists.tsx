import { Link } from "react-router-dom";
import { useStore } from "../store";

export function ArtistsPage() {
  const { artists, products } = useStore();
  return (
    <main className="page">
      <header className="page-head">
        <h1>artists</h1>
        <p>The people posting the work. Every listing is tied to a person, not a generator.</p>
      </header>
      <ul className="artist-list">
        {artists.map((artist) => {
          const count = products.filter((product) => product.artistId === artist.id).length;
          return (
            <li key={artist.id}>
              <Link to={`/artists/${artist.id}`}>
                <strong>{artist.name}</strong>
                <span>{artist.city}</span>
                <span>{count} listings</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
