import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function normalizeTmdbMovie(movie, imageBaseUrl) {
  return {
    imdbID: String(movie.id),
    Title: movie.title || movie.name || "Untitled",
    Year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    Poster: movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : "",
    Plot: movie.overview || "No description available.",
    Genre: movie.genres ? movie.genres.map((g) => g.name).join(", ") : "N/A",
    Director: "N/A"
  };
}

export default function MovieDetails({ addToWatchlist, addReview, watchlist, reviews }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
  const TMDB_BASE_URL =
    import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE_URL =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL ||
    "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError("");

      if (!TMDB_TOKEN) {
        setError("TMDB API token is not configured.");
        setIsLoading(false);
        return;
      }

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
        } else {
          setError("Movie not found.");
        }
      } catch {
        setError("Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const [reviewText, setReviewText] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  if (isLoading) {
    return (
      <div className="page">
        <p className="status">Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="page">
        <p className="status error">{error || "Movie not found."}</p>
      </div>
    );
  }

  const isSaved = watchlist.some((item) => item.imdbID === movie.imdbID);
  const movieReviews = reviews.filter((r) => r.movieId === movie.imdbID);

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
  };

  return (
    <div className="page">
      <div className="movieMainColumn">
        <div className="titleRow">
          <h1>{movie.Title}</h1>
        </div>

        {movie.Poster && (
          <div className="movieLargePoster">
            <img src={movie.Poster} alt={movie.Title} />
          </div>
        )}

        <section className="infoBlock">
          <h2>Movie Information</h2>
          {movie.Year && movie.Year !== "N/A" && <p><strong>Year:</strong> {movie.Year}</p>}
          {movie.Genre && movie.Genre !== "N/A" && <p><strong>Genre:</strong> {movie.Genre}</p>}
          {movie.Director && movie.Director !== "N/A" && <p><strong>Director:</strong> {movie.Director}</p>}
          {movie.Plot && movie.Plot !== "No description available." && <p>{movie.Plot}</p>}
        </section>

        <section className="infoBlock">
          <div className="detailActions">
            <button className="actionBtn" type="button" onClick={handleSave}>
              {isSaved ? "Saved" : "Save to List"}
            </button>
          </div>
          {savedMessage && <p className="successText">{savedMessage}</p>}
        </section>

        <section className="reviewBox">
          <h2>Leave a Review</h2>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write a short review..."
          />
          <button className="actionBtn" type="button" onClick={handleReview}>
            Submit Review
          </button>
          {reviewMessage && <p className="successText">{reviewMessage}</p>}
        </section>

        <section className="movieReviewsList">
          <h2>Reviews</h2>
          {movieReviews.length === 0 ? (
            <p>No reviews for this movie yet.</p>
          ) : (
            movieReviews.map((review) => (
              <article className="reviewCardStyled" key={review.id}>
                <div className="reviewCardBody">
                  <h3>{review.movieTitle}</h3>
                  <p className="starRow">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                  <p>{review.text}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
