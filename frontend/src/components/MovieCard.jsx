import { useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, addToWatchlist }) {
  const [imgFailed, setImgFailed] = useState(false);
  const posterAvailable = movie.Poster && movie.Poster !== "N/A" && !imgFailed;

  return (
    <article className="card">
      <Link to={`/movie/${movie.imdbID}`} className="cardLink">
        {posterAvailable ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="noPoster">No Poster</div>
        )}

        <div className="cardContent">
          <h3>{movie.Title}</h3>
          <p>Release year: {movie.Year}</p>
        </div>
      </Link>

      <div className="cardActions">
        <button className="actionBtn" onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
      </div>
    </article>
  );
}
