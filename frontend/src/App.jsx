import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Reviews from "./pages/Reviews.jsx";
import Profile from "./pages/Profile.jsx";

// normalize TMDb movie data to match our internal format
function normalizeTmdbMovie(movie, imageBaseUrl) {
  return {
    movieId: String(movie.id),
    Title: movie.title || movie.name || "Untitled",
    Year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    Poster: movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : "",
    Plot: movie.overview || "No description available.",
    Genre: "N/A",
    Director: "N/A"
  };
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTrending, setIsTrending] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);

  // normalize backend interaction data to match our frontend format
  // reconstruct poster URL using TMDB base URL + poster path from backend
  const normalizeInteraction = (row) => {
    const base = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";
    const poster = row.posterPath ? `${base}${row.posterPath}` : "";
    return {
      interactionId: row.interactionId,
      movieId: String(row.movieId),
      Title: row.title,
      Poster: poster,
      Year: row.releaseDate ? String(row.releaseDate).slice(0, 4) : "N/A",
      listStatus: row.listStatus,
      // use dateWatched, otherwise dateAdded for sorting
      lastUpdated: new Date(row.dateWatched || row.dateAdded).getTime() + (row.interactionId || 0)
    };
  };

  // fetch UserMovieInteraction data and normalize it for frontend use
  const fetchWatchlist = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/interactions', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.map(normalizeInteraction));
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error.message);
    }
  };

  // fetch user reviews from backend
  // populates reviews page
  const fetchUserReviews = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reviews/user', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const base = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";
        setReviews(data.map(review => ({
          ...review,
          moviePoster: review.moviePoster ? `${base}${review.moviePoster}` : ""
        })));
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error.message);
    }
  };

  // check session cookie on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/session', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.username);
          setCurrentUserId(data.userid);
          setIsLoggedIn(true);
          await fetchWatchlist();
          await fetchUserReviews();
        }
      } catch (error) {
        console.error('Session check error:', error.message);
      } finally {
        setSessionChecked(true);
      }
    };
    checkSession();
  }, []);

  // auth user and fetch watchlist
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Login failed.' };
      }

      setCurrentUser(data.username);
      setCurrentUserId(data.userid);
      setIsLoggedIn(true);
      await fetchWatchlist();
      await fetchUserReviews();
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  // register new user
  const handleSignup = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: username + '@cinematch.com', password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Sign up failed.' };
      }

      return { success: true, message: 'Account created successfully! You can now log in.' };
    } catch (error) {
      console.error('Signup error:', error.message);
      return { success: false, message: 'Server error. Please try again.' };
    }
  };

  // clear session cookie and reset auth state
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      setCurrentUser(null);
      setCurrentUserId(null);
      setIsLoggedIn(false);
      setWatchlist([]);
      setReviews([]);
    }
  };

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
  const TMDB_BASE_URL =
    import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE_URL =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL ||
    "https://image.tmdb.org/t/p/w500";

  // fetch movies from TMDB API based on search term or trending if no term
  const fetchMovies = async (query) => {
    setIsLoading(true);
    setError("");

    if (!TMDB_TOKEN) {
      setMovies([]);
      setError("TMDB API token is not configured. Please set VITE_TMDB_READ_ACCESS_TOKEN in your .env file.");
      setIsLoading(false);
      return;
    }

    try {
      let url;
      if (!query) {
        // Fetch trending movies because no search term
        url = `${TMDB_BASE_URL}/trending/movie/week?language=en-US`;
      } else {
        url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&include_adult=false&language=en-US&page=1`;
      }

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
        setMovies([]);
        setError(query ? "No results found for that search." : "Failed to load trending movies.");
      }
    } catch (err) {
      setMovies([]);
      setError("Failed to fetch movies from TMDB. Check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // re fetch when search term changes
  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setIsTrending(false);
  };

  // add movie to watchlist immediately, then sync with backend
  // revert if fails
  const addToWatchlist = async (movie) => {
    const alreadyExists = watchlist.some((item) => item.movieId === movie.movieId);
    if (alreadyExists) return;

    const newEntry = { ...movie, listStatus: "WANT_TO_WATCH", lastUpdated: Date.now() };
    setWatchlist((prev) => [...prev, newEntry]);

    try {
      const response = await fetch('http://localhost:3000/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          movieId: movie.movieId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // update with real interactionId from backend
        await fetchWatchlist();
      } else {
        setWatchlist((prev) => prev.filter((item) => item.movieId !== movie.movieId));
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error.message);
      setWatchlist((prev) => prev.filter((item) => item.movieId !== movie.movieId));
    }
  };

  // mark as watched immediately, then sync with backend
  // revert if fails
  const markAsWatched = async (interactionId) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.interactionId === interactionId
          ? { ...item, listStatus: "WATCHED", lastUpdated: Date.now() }
          : item
      )
    );

    try {
      const response = await fetch(`http://localhost:3000/api/interactions/${interactionId}/watched`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) {
        await fetchWatchlist();
      }
    } catch (error) {
      console.error('Error marking as watched:', error.message);
      await fetchWatchlist();
    }
  };

  // remove from watchlist immediately, then sync with backend
  // revert if fails
  const removeFromWatchlist = async (interactionId) => {
    setWatchlist((prev) => prev.filter((item) => item.interactionId !== interactionId));

    try {
      const response = await fetch(`http://localhost:3000/api/interactions/${interactionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        await fetchWatchlist();
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error.message);
      await fetchWatchlist();
    }
  };

  // add a review to backend and refresh user reviews on success
  const addReview = async (movie, text, rating) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${movie.movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, text })
      });

      if (response.ok) {
        await fetchUserReviews();
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, message: data.error || 'Failed to add review.' };
      }
    } catch (error) {
      console.error('Error adding review:', error.message);
      return { success: false, message: 'Server error. Please try again.' };
    }
  };

  if (!sessionChecked) return null;

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
              watchlist={watchlist}
              searchTerm={searchTerm}
              isTrending={isTrending}
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
              currentUser={currentUser}
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
              markAsWatched={markAsWatched}
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