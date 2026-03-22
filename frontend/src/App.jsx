import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("Batman");
  const [watchlist, setWatchlist] = useState([]);

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
      setMovies([]);
      setError("No API key provided.");
      setIsLoading(false);
      return;
    }

    try {
      const url =
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found.");
      }

    } catch (err) {
      setError("Failed to fetch movies.");
      setMovies([]);
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
          path="/watchlist"
          element={
            <Watchlist
              watchlist={watchlist}
              addToWatchlist={addToWatchlist}
            />
          }
        />
        <Route
          path="/reviews"
          element={
            <div className="page">
              <div className="hero">
                <h1>Reviews</h1>
                <p>Coming soon!</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
