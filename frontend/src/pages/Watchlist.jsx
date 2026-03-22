import MovieGrid from "../components/MovieGrid.jsx";

export default function Watchlist({ watchlist, addToWatchlist }) {
  return (
    <div className="page">
      <div className="hero">
        <h1>My Watchlist</h1>
        <p>Movies you've saved to watch later.</p>
      </div>

      <main className="panel">
        {watchlist.length === 0 ? (
          <p className="status">No movies in your watchlist yet. Search for movies and add them!</p>
        ) : (
          <MovieGrid movies={watchlist} addToWatchlist={addToWatchlist} />
        )}
      </main>
    </div>
  );
}
