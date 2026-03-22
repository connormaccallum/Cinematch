import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockMovies } from "../data/mockMovies.js";
import MovieGrid from "../components/MovieGrid.jsx";

export default function MovieDetails({ addToWatchlist, addReview, watchlist }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = useMemo(
    () => mockMovies.find((item) => item.imdbID === id) || mockMovies[0],
    [id]
  );

  const relatedMovies = useMemo(
    () => mockMovies.filter((item) => item.imdbID !== movie.imdbID).slice(0, 4),
    [movie]
  );

  const [reviewText, setReviewText] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

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
          {[movie, ...relatedMovies.slice(0, 2)].map((item) => (
            <div className="sidebarCard" key={item.imdbID}>
              <div className="sidebarThumb">
                <img src={item.Poster} alt={item.Title} />
              </div>
              <p>MOVIE INFORMATION</p>
            </div>
          ))}
        </aside>
      </section>

      <section className="relatedSection">
        <MovieGrid movies={relatedMovies} compact />
      </section>
    </main>
  );
}
