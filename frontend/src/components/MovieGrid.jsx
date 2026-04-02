import MovieCard from "./MovieCard.jsx";

export default function MovieGrid({ movies, addToWatchlist, hideWatchlistBtn, watchlist }) {
  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          addToWatchlist={addToWatchlist}
          hideWatchlistBtn={hideWatchlistBtn}
          watchlist={watchlist}
        />
      ))}
    </div>
  );
}
