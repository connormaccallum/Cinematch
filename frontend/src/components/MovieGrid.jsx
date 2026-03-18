import MovieCard from "./MovieCard.jsx";

export default function MovieGrid({ movies, addToWatchlist }) {
  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} addToWatchlist={addToWatchlist} />
      ))}
    </div>
  );
}
