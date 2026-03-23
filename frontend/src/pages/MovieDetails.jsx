import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function normalizeTmdbMovie(movie, imageBaseUrl) {
  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  return {
    imdbID: String(movie.id),
    Title: movie.title || movie.name || "Untitled",
    Year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    Poster: movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : "",
    Plot: movie.overview || "No description available.",
    Genre: movie.genres ? movie.genres.map((g) => g.name).join(", ") : "N/A",
    Director: director ? director.name : "N/A"
  };
}

export default function MovieDetails({ addToWatchlist, addReview, watchlist, reviews, currentUser }) {
  const { id } = useParams();

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
          `${TMDB_BASE_URL}/movie/${encodeURIComponent(id)}?language=en-US&append_to_response=credits`,
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
  const [reviewRating, setReviewRating] = useState(0);
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
    if (reviewRating === 0) {
      setReviewMessage("Please select a star rating.");
      return;
    }

    addReview(movie, reviewText, reviewRating, currentUser);
    setReviewText("");
    setReviewRating(0);
    setReviewMessage("Review added.");
  };

  return (
    <div className="page">
      <div className="movieMainColumn">
        <div className="movieDetailHeader">
          {movie.Poster && (
            <div className="movieDetailPoster">
              <img src={movie.Poster} alt={movie.Title} />
            </div>
          )}
          <div className="movieDetailInfo">
            <h1>{movie.Title}</h1>
            {movie.Year && movie.Year !== "N/A" && <p><strong>Year:</strong> {movie.Year}</p>}
            {movie.Genre && movie.Genre !== "N/A" && <p><strong>Genre:</strong> {movie.Genre}</p>}
            {movie.Director && movie.Director !== "N/A" && <p><strong>Director:</strong> {movie.Director}</p>}
            <div className="detailActions">
              <button className="actionBtn" type="button" onClick={handleSave}>
                {isSaved ? "Saved" : "Save to List"}
              </button>
            </div>
            {savedMessage && <p className="successText">{savedMessage}</p>}
          </div>
        </div>

        {movie.Plot && movie.Plot !== "No description available." && (
          <section className="infoBlock">
            <h2>Description</h2>
            <p>{movie.Plot}</p>
          </section>
        )}

        <section className="reviewBox">
          <h2>Leave a Review</h2>
          <div className="starPicker">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`starPickerBtn ${star <= reviewRating ? "starFilled" : ""}`}
                onClick={() => setReviewRating(star)}
              >
                {star <= reviewRating ? "★" : "☆"}
              </button>
            ))}
          </div>
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
                  <p className="reviewUser">{review.username || "Anonymous"}</p>
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
