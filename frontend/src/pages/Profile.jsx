import React from "react";
import { Link } from "react-router-dom";

export default function Profile({ currentUser, watchlist, reviews }) {
  const recentActivity = watchlist.length > 0 ? [...watchlist].sort((a, b) => b.lastUpdated - a.lastUpdated)[0] : null;

  const recentReview = reviews.length > 0 ? reviews[0] : null;

  return (
    <div className="page">
      <div className="hero">
        <h1>Hello, {currentUser}</h1>
        <p>Your profile and activity at a glance.</p>
      </div>

      <section className="profileLayout">
        <aside className="profileSavedColumn">
          <h3>Recent Activity</h3>

          {recentActivity ? (
            <Link to={`/movie/${recentActivity.movieId}`} className="profileMovieCard">
              {recentActivity.Poster ? (
                <img src={recentActivity.Poster} alt={recentActivity.Title} />
              ) : (
                <div className="profileMovieNoPoster">No Poster</div>
              )}
              <div style={{ padding: "8px 10px 10px" }}>
                <p className="profileMovieCardTitle">{recentActivity.Title}</p>
                <div className={recentActivity.listStatus === "WATCHED" ? "watchedBadge" : "wantToWatchBadge"}>
                  {recentActivity.listStatus === "WATCHED" ? "✓ Watched" : "Want to Watch"}
                </div>
              </div>
            </Link>
          ) : (
            <p>No activity yet.</p>
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
            <h3>Most Recent Review</h3>
            {recentReview ? (
              <article className="reviewCardStyled">
                {recentReview.moviePoster && (
                  <div className="reviewCardPoster">
                    <img src={recentReview.moviePoster} alt={recentReview.movieTitle} />
                  </div>
                )}
                <div className="reviewCardBody">
                  <h3>{recentReview.movieTitle}</h3>
                  <p className="reviewUser">{recentReview.username || "Anonymous"}</p>
                  <p className="starRow">{"★".repeat(recentReview.rating)}{"☆".repeat(5 - recentReview.rating)}</p>
                  <p>{recentReview.text}</p>
                </div>
              </article>
            ) : (
              <p>No reviews written yet.</p>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}