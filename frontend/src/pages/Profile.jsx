import React from "react";
import { Link } from "react-router-dom";

export default function Profile({ currentUser, watchlist, reviews }) {
  const savedPreview = watchlist.slice(0, 5);

  return (
    <div className="page">
      <div className="hero">
        <h1>Hello, {currentUser}</h1>
        <p>Your profile and activity at a glance.</p>
      </div>

      <section className="profileLayout">
        <aside className="profileSavedColumn">
          <h3>Saved Movies</h3>

          {savedPreview.length === 0 ? (
            <p>No saved titles yet.</p>
          ) : (
            savedPreview.map((movie) => (
              <Link to={`/movie/${movie.imdbID}`} className="profileMovieCard" key={movie.imdbID}>
                {movie.Poster ? (
                  <img src={movie.Poster} alt={movie.Title} />
                ) : (
                  <div className="profileMovieNoPoster">No Poster</div>
                )}
                <p className="profileMovieCardTitle">{movie.Title}</p>
              </Link>
            ))
          )}
        </aside>

        <div className="profileMainColumn">
          <section className="profileInfoCard">
            <div>
              <h3>Profile Information</h3>
              <p>Email: {currentUser.toLowerCase()}@example.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Preferences: Action, Sci-Fi, Drama</p>
            </div>

            <div className="profileAvatarCircle" />
          </section>

          <section className="reviewsLargePanel">
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews written yet.</p>
            ) : (
              reviews.map((review) => (
                <article className="reviewCardStyled" key={review.id}>
                  {review.moviePoster && (
                    <div className="reviewCardPoster">
                      <img src={review.moviePoster} alt={review.movieTitle} />
                    </div>
                  )}
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
      </section>
    </div>
  );
}
