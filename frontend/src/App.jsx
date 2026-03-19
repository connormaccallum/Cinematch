import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieGrid from "./components/MovieGrid.jsx";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("Batman");
  const [watchlist, setWatchlist] = useState([]);


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

  return (
    <div className="page">
      <Header title="Movie Search Engine" searchTerm={searchTerm} />
        <SearchBar onSearch={handleSearch} />

      <main className="panel">
            {isLoading ? (
              <p className="status">Loading...</p>
            ) : error ? (
              <p className="status error">{error}</p>
            ) : movies.length === 0 ? (
              <p className="status">No movies found.</p>
            ) : (
              <MovieGrid movies={movies} addToWatchlist={addToWatchlist} />
            )}

            <section className="watchlist">
              <h2>My Watchlist</h2>
              {watchlist.length === 0 ? (
                <p>No movies in watchlist yet.</p>
              ) : (
                <MovieGrid movies={watchlist} addToWatchlist={addToWatchlist} />
              )}
            </section>
        </main>
    </div>
  );
}
