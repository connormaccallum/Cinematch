import { useState } from "react";
import { Link } from "react-router-dom";

// card for watchlist entries
// different for want to watch vs watched
function WatchlistCard({ movie, onMarkWatched, onRemove }) {
  const [imgFailed, setImgFailed] = useState(false);
  const posterAvailable = movie.Poster && movie.Poster !== "N/A" && !imgFailed;

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

      {/* want to watch tab has buttons*/}
      {onMarkWatched && (
        <div className="cardActions watchlistCardActions">
          <button className="actionBtn" onClick={() => onMarkWatched(movie.interactionId)}>
            Mark as Watched
          </button>
          <button className="watchlistRemoveBtn" onClick={() => onRemove(movie.interactionId)}>
            Remove
          </button>
        </div>
      )}
      {/* watched tab has static badge */}
      {!onMarkWatched && (
        <div className="cardActions">
          <div className="watchedBadge">&#10003; Watched</div>
        </div>
      )}
    </article>
  );
}

export default function Watchlist({ watchlist, markAsWatched, removeFromWatchlist }) {
  console.log('Watchlist state:', watchlist);
  const [activeTab, setActiveTab] = useState("want");

  const wantToWatch = watchlist.filter((m) => m.listStatus === "WANT_TO_WATCH");
  const watched = watchlist.filter((m) => m.listStatus === "WATCHED");
  const displayed = activeTab === "want" ? wantToWatch : watched;

  return (
    <div className="page">
      <div className="hero">
        <h1>My Watchlist</h1>
        <p>Movies you've saved to watch later.</p>
      </div>

      {/* tab bar toggles between want to watch and watched */}
      <div className="watchlistTabs">
        <button
          className={`watchlistTab${activeTab === "want" ? " watchlistTabActive" : ""}`}
          onClick={() => setActiveTab("want")}
        >
          Want to Watch
          <span className={`watchlistTabBadge${activeTab === "want" ? " watchlistTabBadgeActive" : ""}`}>
            {wantToWatch.length}
          </span>
        </button>
        <button
          className={`watchlistTab${activeTab === "watched" ? " watchlistTabActive" : ""}`}
          onClick={() => setActiveTab("watched")}
        >
          Watched
          <span className={`watchlistTabBadge${activeTab === "watched" ? " watchlistTabBadgeActive" : ""}`}>
            {watched.length}
          </span>
        </button>
      </div>

      <main className="panel" style={{ marginTop: "0", borderTopLeftRadius: "0", borderTopRightRadius: "0" }}>
        {displayed.length === 0 ? (
          <p className="status">
            {activeTab === "want"
              ? "You haven't added any movies to your watchlist yet! Search for movies and click the 'Add to Watchlist' button!"
              : "You haven't watched any movies yet! Mark movies as 'Watched' from your 'Want to Watch' list!"}
          </p>
        ) : (
          <div className="grid">
            {displayed.map((movie) => (
              <WatchlistCard
                key={movie.movieId}
                movie={movie}
                // action handlers only on want to watch tab
                onMarkWatched={activeTab === "want" ? markAsWatched : null}
                onRemove={activeTab === "want" ? removeFromWatchlist : null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}