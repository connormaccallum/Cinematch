import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Reviews from "./pages/Reviews.jsx";
import Profile from "./pages/Profile.jsx";
import { mockMovies } from "./data/mockMovies.js";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("Batman");
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

  const handleLogin = (username, password) => {
    // TODO: connect to backend authentication
    setCurrentUser(username);
    setIsLoggedIn(true);
  };

  const handleSignup = (username, password) => {
    // TODO: connect to backend registration
    setCurrentUser(username);
    setIsLoggedIn(true);
  };

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setError("");

    if (!API_KEY || API_KEY === "ENTER_OMDB_API_KEY_HERE") {
      const filteredMockMovies = mockMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setMovies(filteredMockMovies.length ? filteredMockMovies : mockMovies);
      setError("Using placeholder movie data.");
      setIsLoading(false);
      return;
    }

    try {
      const url = `https://www.omdbapi.com/?s=${encodeURIComponent(
        query
      )}&apikey=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        const filteredMockMovies = mockMovies.filter((movie) =>
          movie.Title.toLowerCase().includes(query.toLowerCase())
        );
        setMovies(filteredMockMovies);
        setError(data.Error || "Using placeholder movie data.");
      }
    } catch (err) {
      const filteredMockMovies = mockMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setMovies(filteredMockMovies.length ? filteredMockMovies : mockMovies);
      setError("Failed to fetch movies. Using placeholder movie data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const addToWatchlist = (movie) => {
    setWatchlist((prevWatchlist) => {
      const alreadyExists = prevWatchlist.some(
        (item) => item.imdbID === movie.imdbID
      );
      if (alreadyExists) {
        return prevWatchlist;
      }
      return [...prevWatchlist, movie];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.imdbID !== movieId)
    );
  };

  const addReview = (movie, text, rating) => {
    const newReview = {
      id: Date.now(),
      movieId: movie.imdbID,
      movieTitle: movie.Title,
      text,
      rating
    };
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              movies={movies}
              isLoading={isLoading}
              error={error}
              onSearch={handleSearch}
              addToWatchlist={addToWatchlist}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchPage
              addToWatchlist={addToWatchlist}
            />
          }
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
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
            />
          }
        />
        <Route
          path="/reviews"
          element={<Reviews reviews={reviews} />}
        />
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
      </Routes>
    </BrowserRouter>
  );
}
