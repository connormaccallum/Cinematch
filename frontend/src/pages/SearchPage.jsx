import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { mockMovies } from "../data/mockMovies.js";

export default function SearchPage({ addToWatchlist }) {
  const [movies, setMovies] = useState(mockMovies);
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);
  const [status, setStatus] = useState("Showing placeholder movies.");
  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    setMovies(mockMovies);
    setFilteredMovies(mockMovies);
  }, []);

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredMovies(movies);
      setStatus("Showing all movies.");
      return;
    }

    if (!API_KEY || API_KEY === "ENTER_OMDB_API_KEY_HERE") {
      const localResults = movies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(localResults);
      setStatus("Using placeholder data.");
      return;
    }

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setFilteredMovies(data.Search);
        setStatus(`Showing results for "${query}".`);
      } else {
        setFilteredMovies([]);
        setStatus("No movies found.");
      }
    } catch {
      const localResults = movies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(localResults);
      setStatus("Could not reach API. Using placeholder data.");
    }
  };

  return (
    <main className="pageSection">
      <section className="searchHeaderSection">
        <SearchBar onSearch={handleSearch} />
        <p className="sectionNote">{status}</p>
      </section>

      <section>
        <MovieGrid movies={filteredMovies} addToWatchlist={addToWatchlist} />
      </section>
    </main>
  );
}
