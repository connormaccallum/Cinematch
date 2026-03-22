import React from "react";
import { Link } from "react-router-dom";

export default function Profile({ currentUser, watchlist, reviews }) {
  const savedPreview = watchlist.slice(0, 5);

  return (
    <main className="pageSection">
      <h1 className="profileGreeting">Hello, {currentUser}</h1>

      <section className="profileLayout">
        <aside className="profileSavedColumn">
          <h3>Saved Movies</h3>

          {savedPreview.length === 0 ? (
            <p>No saved titles yet.</p>
          ) : (
            savedPreview.map((movie) => (
              <div className="profileSavedItem" key={movie.imdbID}>
                <div className="profileSavedThumb">
                  <img src={movie.Poster} alt={movie.Title} />
                </div>
                <div>
                  <p className="profileMiniTitle">{movie.Title}</p>
                  <Link to={`/movie/${movie.imdbID}`}>View</Link>
                </div>
              </div>
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
                <article className="profileReviewItem" key={review.id}>
                  <strong>{review.movieTitle}</strong>
                  <p>{review.text}</p>
                </article>
              ))
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
