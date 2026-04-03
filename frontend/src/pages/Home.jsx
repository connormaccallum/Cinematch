import SearchBar from "../components/SearchBar.jsx";
import MovieGrid from "../components/MovieGrid.jsx";

export default function Home({ movies, isLoading, error, onSearch, addToWatchlist, watchlist, searchTerm, isTrending }) {
  return (
    <div className="page">
      <div className="heroSplit">
        <div className="heroMain">
          <h1>Movie Search Engine</h1>
          <p>Search for your favorite movies and add them to your watchlist!</p>
        </div>
        <div className="heroSearch">
          <span className="heroSearchLabel">Current Search:</span>
          <span className="heroSearchValue">{isTrending ? "Trending" : searchTerm}</span>
        </div>
      </div>

      <SearchBar onSearch={onSearch} />

      <main className="panel">
        {isLoading ? (
          <p className="status">Loading...</p>
        ) : error ? (
          <p className="status error">{error}</p>
        ) : movies.length === 0 ? (
          <p className="status">No movies found.</p>
        ) : (
          <MovieGrid movies={movies} addToWatchlist={addToWatchlist} watchlist={watchlist} />
        )}
      </main>
    </div>
  );
}
