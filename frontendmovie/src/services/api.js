// src/services/api.js
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_KEY;

/** Helpers */
function q(params) {
  const p = new URLSearchParams(params);
  // TMDB common defaults
  if (!p.has("include_adult")) p.set("include_adult", "false");
  return p.toString();
}
async function getJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    // Surface TMDB errors in console; throw for UI to handle
    const text = await res.text().catch(() => "");
    console.error("TMDB error", res.status, text);
    throw new Error(`TMDB ${res.status}`);
  }
  return res.json();
}

/** Popular (landing) */
export async function getPopularMovies(page = 1) {
  const url = `${BASE_URL}/movie/popular?${q({ api_key: API_KEY, page })}`;
  const data = await getJson(url);
  return data.results || [];
}

/** Search by title (supports paging, optional year) */
export async function searchMovies(query, page = 1, year = "") {
  const params = { api_key: API_KEY, query, page };
  if (year) params.year = String(year);
  const url = `${BASE_URL}/search/movie?${q(params)}`;
  const data = await getJson(url);
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
  };
}

/** Genres for dropdown */
export async function getGenres() {
  const url = `${BASE_URL}/genre/movie/list?${q({ api_key: API_KEY })}`;
  const data = await getJson(url);
  return data.genres || [];
}

/** Server-side filtering via Discover */
export async function discoverMovies({
  page = 1,
  sortBy = "popularity.desc",
  minRating = "",
  year = "",
  genreId = "",
}) {
  const params = {
    api_key: API_KEY,
    sort_by: sortBy,
    page,
  };
  if (minRating) params["vote_average.gte"] = String(minRating);
  if (year) params.year = String(year);
  if (genreId) params.with_genres = String(genreId);

  const url = `${BASE_URL}/discover/movie?${q(params)}`;
  const data = await getJson(url);
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
  };
}
