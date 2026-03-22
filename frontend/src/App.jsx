import React, { useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Reviews from "./pages/Reviews.jsx";
import Profile from "./pages/Profile.jsx";
import { mockMovies } from "./data/mockMovies.js";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("USERNAME");
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      movieId: "tt1375666",
      movieTitle: "Inception",
      text: "Great visuals and a very interesting concept.",
      rating: 4
    }
  ]);

  const featuredMovie = useMemo(() => mockMovies[0], []);

  const handleLogin = (username) => {
    setCurrentUser(username || "USERNAME");
    setIsLoggedIn(true);
  };

  const handleSignup = (username) => {
    setCurrentUser(username || "USERNAME");
    setIsLoggedIn(true);
  };

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.imdbID === movie.imdbID);
      if (exists) return prev;
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((movie) => movie.imdbID !== movieId));
  };

  const addReview = (movie, text, rating) => {
    const newReview = {
      id: Date.now(),
      movieId: movie.imdbID,
      movieTitle: movie.Title,
      text,
      rating
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} onSignup={handleSignup} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="appShell">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<Home featuredMovie={featuredMovie} movies={mockMovies} />}
            />
            <Route
              path="/search"
              element={<SearchPage addToWatchlist={addToWatchlist} />}
            />
            <Route
              path="/movie/:id"
              element={
                <MovieDetails
                  addToWatchlist={addToWatchlist}
                  addReview={addReview}
                  watchlist={watchlist}
                />
              }
            />
            <Route
              path="/watchlist"
              element={
                <Watchlist
                  watchlist={watchlist}
                  removeFromWatchlist={removeFromWatchlist}
                />
              }
            />
            <Route path="/reviews" element={<Reviews reviews={reviews} />} />
            <Route
              path="/profile"
              element={
                <Profile
                  currentUser={currentUser}
                  watchlist={watchlist}
                  reviews={reviews}
                />
              }
            />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}
