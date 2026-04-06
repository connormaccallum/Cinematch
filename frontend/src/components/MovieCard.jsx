import { useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, addToWatchlist, hideWatchlistBtn, watchlist = [] }) {
  const [imgFailed, setImgFailed] = useState(false);
  const posterAvailable = movie.Poster && movie.Poster !== "N/A" && !imgFailed;

  // find matching entry to read listStatus
  const watchlistEntry = watchlist.find((item) => item.movieId === movie.movieId);
  const isOnWatchlist = !!watchlistEntry;

  // return proper badge based on listStatus
  const getStatusBadge = () => {
    if (!watchlistEntry) return null;
    if (watchlistEntry.listStatus === "WATCHED") {
      return <div className="watchedBadge">&#10003; Watched</div>
    }
    return <div className="wantToWatchBadge">Want to Watch</div>;
  };

  return (
    <article className="card">
      <Link to={`/movie/${movie.movieId}`} className="cardLink">
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
          <p>{movie.Year}</p>
        </div>
      </Link>

      {!hideWatchlistBtn && (
        <div className="cardActions">
          {isOnWatchlist ? (
            getStatusBadge()
          ) : (
            <button
              className="actionBtn"
              onClick={() => addToWatchlist(movie)}
            >
              Add to Watchlist
            </button>
          )}
        </div>
      )}
    </article>
  );
}
