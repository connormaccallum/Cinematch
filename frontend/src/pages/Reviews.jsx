import React from "react";

export default function Reviews({ reviews }) {
  return (
    <div className="page">
      <div className="hero">
        <h1>Reviews</h1>
        <p>See what you've had to say about movies.</p>
      </div>

      <div className="reviewsPagePanel">
        {reviews.length === 0 ? (
          <p className="status">No reviews yet. Watch a movie and leave a review!</p>
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
                <p className="reviewUser">{review.username || "Anonymous"}</p>
                <p className="starRow">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                <p>{review.text}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
