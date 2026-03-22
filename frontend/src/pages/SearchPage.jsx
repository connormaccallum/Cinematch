import React, { useState } from "react";
import MovieGrid from "../components/MovieGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { mockMovies } from "../data/mockMovies.js";

function normalizeTmdbMovie(movie, imageBaseUrl) {
  return {
    imdbID: String(movie.id),
    Title: movie.title || movie.name || "Untitled",
    Year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    Poster: movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Poster",
    Plot: movie.overview || "No description available.",
    Genre: "N/A",
    Director: "N/A"
  };
}

export default function SearchPage({ addToWatchlist }) {
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);
  const [status, setStatus] = useState("Showing placeholder movies.");

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
  const TMDB_BASE_URL =
    import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE_URL =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL ||
    "https://image.tmdb.org/t/p/w500";

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredMovies(mockMovies);
      setStatus("Showing all movies.");
      return;
    }

    if (!TMDB_TOKEN) {
      const localResults = mockMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(localResults);
      setStatus("Using placeholder data.");
      return;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            accept: "application/json"
          }
        }
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setFilteredMovies(
          data.results.map((movie) =>
            normalizeTmdbMovie(movie, TMDB_IMAGE_BASE_URL)
          )
        );
        setStatus(`Showing TMDb results for "${query}".`);
      } else {
        setFilteredMovies([]);
        setStatus("No movies found.");
      }
    } catch {
      const localResults = mockMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(localResults);
      setStatus("Could not reach TMDb. Using placeholder data.");
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
