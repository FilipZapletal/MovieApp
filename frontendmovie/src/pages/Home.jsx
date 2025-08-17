// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import {
  searchMovies,
  getPopularMovies,
  getGenres,
  discoverMovies,
} from "../services/api";
import "../css/Home.css";

function Home() {
  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filters (used when search is empty → Discover)
  const [minRating, setMinRating] = useState("");     // e.g. "7"
  const [year, setYear] = useState("");               // e.g. "2020"
  const [genreId, setGenreId] = useState("");         // e.g. "28"
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);

  // Data
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Status
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load genres once
  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => {})
      .finally(() => {});
  }, []);

  // Initial load: popular
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const popular = await getPopularMovies();
        setMovies(popular);
        setTotalPages(1);
        setError(null);
      } catch {
        setError("Failed to fetch popular movies");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Unified fetcher: Search when there's a query, otherwise Discover with filters
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      if (searchQuery.trim()) {
        const { results, total_pages } = await searchMovies(
          searchQuery.trim(),
          page
        );
        setMovies(results);
        setTotalPages(total_pages || 1);
      } else {
        const { results, total_pages } = await discoverMovies({
          page,
          sortBy,
          minRating,
          year,
          genreId,
        });
        setMovies(results);
        setTotalPages(total_pages || 1);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search typing
  const debounceRef = useRef(null);
  useEffect(() => {
    if (searchQuery.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setPage(1);
        fetchMovies();
      }, 400);
    }
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // React to page or any discover filter change (when not searching)
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchMovies();
    }
  }, [minRating, year, genreId, sortBy, page]);

  // Manual search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  return (
    <div className="home">
      {/* Search */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Pretty Filters */}
      <FilterBar
        searchActive={!!searchQuery.trim()}
        // Wrapped setters => any filter change resets to page 1
        minRating={minRating} setMinRating={(val) => { setMinRating(val); setPage(1); }}
        year={year} setYear={(val) => { setYear(val); setPage(1); }}
        genreId={genreId} setGenreId={(val) => { setGenreId(val); setPage(1); }}
        genres={genres}
        sortBy={sortBy} setSortBy={(val) => { setSortBy(val); setPage(1); }}
        onReset={() => {
          setMinRating("");
          setYear("");
          setGenreId("");
          setSortBy("popularity.desc");
          setPage(1);
        }}
      />

      {/* Errors */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading / Results */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>

            <span>Page {page} / {Math.max(totalPages, 1)}</span>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
