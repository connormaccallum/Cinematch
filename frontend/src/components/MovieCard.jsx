export default function MovieCard({ movie, addToWatchlist }) {
  const posterAvailable = movie.Poster && movie.Poster !== "N/A";

  return (
    <article className="card">
      {posterAvailable ? (
        <img src={movie.Poster} alt={movie.Title} />
      ) : (
        <div className="noPoster">No Poster</div>
      )}

      <div className="cardContent">
        <h3>{movie.Title}</h3>

        <p>Title: {movie.Title}</p>
        <p>Release year: {movie.Year}</p>

        <button onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
      </div>
    </article>
  );
}
