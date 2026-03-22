import React from "react";

export default function Reviews({ reviews }) {
  return (
    <main className="pageSection">
      <h1 className="sectionHeading">Reviews</h1>

      <div className="reviewsPagePanel">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <article className="reviewCard" key={review.id}>
              <h3>{review.movieTitle}</h3>
              <p className="starRow">{"★".repeat(review.rating)}</p>
              <p>{review.text}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
