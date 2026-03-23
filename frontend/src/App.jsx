import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Reviews from "./pages/Reviews.jsx";
import Profile from "./pages/Profile.jsx";
import { mockMovies } from "./data/mockMovies.js";

function normalizeTmdbMovie(movie, imageBaseUrl) {
  return {
    imdbID: String(movie.id),
    Title: movie.title || movie.name || "Untitled",
    Year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    Poster: movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : "https://placehold.co/300x450?text=No+Poster",
    Plot: movie.overview || "No description available.",
    Genre: "N/A",
    Director: "N/A"
  };
}

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
      movieId: "27205",
      movieTitle: "Inception",
      text: "Great visuals and a very interesting concept.",
      rating: 4
    }
  ]);

  const handleLogin = (username, password) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
  };

  const handleSignup = (username, password) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
  };

  // TODO: Adjust logic to not expose token in frontend
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
  const TMDB_BASE_URL =
    import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE_URL =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL ||
    "https://image.tmdb.org/t/p/w500";

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setError("");

    if (!TMDB_TOKEN) {
      const filteredMockMovies = mockMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setMovies(filteredMockMovies.length ? filteredMockMovies : mockMovies);
      setError("Using placeholder movie data.");
      setIsLoading(false);
      return;
    }

    try {
      const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: "application/json"
        }
      });

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const normalizedMovies = data.results.map((movie) =>
          normalizeTmdbMovie(movie, TMDB_IMAGE_BASE_URL)
        );
        setMovies(normalizedMovies);
      } else {
        const filteredMockMovies = mockMovies.filter((movie) =>
          movie.Title.toLowerCase().includes(query.toLowerCase())
        );
        setMovies(filteredMockMovies.length ? filteredMockMovies : mockMovies);
        setError("No TMDb results found. Using placeholder movie data.");
      }
    } catch (err) {
      const filteredMockMovies = mockMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setMovies(filteredMockMovies.length ? filteredMockMovies : mockMovies);
      setError("Failed to fetch TMDb movies. Using placeholder movie data.");
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
      </Routes>
    </BrowserRouter>
  );
}

