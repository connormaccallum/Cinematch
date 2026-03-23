import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockMovies } from "../data/mockMovies.js";

function normalizeTmdbMovie(movie, imageBaseUrl) {
  return {
    imdbID: String(movie.id),
    Title: movie.title || movie.name || "Untitled",
    Year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    Poster: movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : "https://placehold.co/300x450?text=No+Poster",
    Plot: movie.overview || "No description available.",
    Genre: movie.genres ? movie.genres.map((g) => g.name).join(", ") : "N/A",
    Director: "N/A"
  };
}

export default function MovieDetails({ addToWatchlist, addReview, watchlist }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
  const TMDB_BASE_URL =
    import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE_URL =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL ||
    "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);

      // Try mock movies first (for mock IDs like "tt1375666")
      const mockMatch = mockMovies.find((item) => item.imdbID === id);
      if (mockMatch) {
        setMovie(mockMatch);
        setIsLoading(false);
        return;
      }

      // Fetch from TMDB API
      if (TMDB_TOKEN) {
        try {
          const response = await fetch(
            `${TMDB_BASE_URL}/movie/${encodeURIComponent(id)}?language=en-US`,
            {
              headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`,
                accept: "application/json"
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            setMovie(normalizeTmdbMovie(data, TMDB_IMAGE_BASE_URL));
            setIsLoading(false);
            return;
          }
        } catch {
          // Fall through to fallback
        }
      }

      // Fallback
      setMovie(mockMovies[0]);
      setIsLoading(false);
    };

    fetchMovie();
  }, [id]);

  const [reviewText, setReviewText] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  if (isLoading || !movie) {
    return (
      <div className="page">
        <p className="status">Loading movie details...</p>
      </div>
    );
  }

  const isSaved = watchlist.some((item) => item.imdbID === movie.imdbID);

  const handleSave = () => {
    addToWatchlist(movie);
    setSavedMessage("Movie saved to your watchlist.");
  };

  const handleReview = () => {
    if (!reviewText.trim()) {
      setReviewMessage("Enter a short review first.");
      return;
    }

    addReview(movie, reviewText, 4);
    setReviewText("");
    setReviewMessage("Review added.");
    navigate("/reviews");
  };

  return (
    <main className="pageSection">
      <section className="movieDetailsTop">
        <div className="movieMainColumn">
          <div className="titleRow">
            <h1>{movie.Title}</h1>
            <span className="titleStars">★★★★★</span>
          </div>

          <div className="movieLargePoster">
            <img src={movie.Poster} alt={movie.Title} />
          </div>

          <section className="infoBlock">
            <h2>MOVIE INFORMATION</h2>
            <p><strong>Year:</strong> {movie.Year}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p>{movie.Plot}</p>
          </section>

          <section className="infoBlock">
            <h2>MOVIE INFORMATION</h2>
            <p>
              This second content block is placeholder content to match the
              wireframe structure.
            </p>

            <div className="detailActions">
              <button className="actionBtn" type="button" onClick={handleSave}>
                {isSaved ? "Saved" : "Save to List"}
              </button>

              <button
                className="actionBtn secondaryBtn"
                type="button"
                onClick={handleReview}
              >
                Leave Review
              </button>
            </div>

            {savedMessage && <p className="successText">{savedMessage}</p>}
          </section>

          <section className="reviewBox">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write a short review..."
            />
            {reviewMessage && <p className="successText">{reviewMessage}</p>}
          </section>
        </div>

        <aside className="movieSidebar">
          <div className="sidebarCard">
            <div className="sidebarThumb">
              <img src={movie.Poster} alt={movie.Title} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
