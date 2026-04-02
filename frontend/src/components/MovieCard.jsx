import { useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, addToWatchlist, hideWatchlistBtn, watchlist = [] }) {
  const [imgFailed, setImgFailed] = useState(false);
  const posterAvailable = movie.Poster && movie.Poster !== "N/A" && !imgFailed;
  const isOnWatchlist = watchlist.some((item) => item.imdbID === movie.imdbID);

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

      {!hideWatchlistBtn && (
        <div className="cardActions">
          <button
            className={`actionBtn${isOnWatchlist ? " actionBtnDisabled" : ""}`}
            onClick={() => !isOnWatchlist && addToWatchlist(movie)}
            disabled={isOnWatchlist}
          >
            {isOnWatchlist ? "On Watchlist" : "Add to Watchlist"}
          </button>
        </div>
      )}
    </article>
  );
}
