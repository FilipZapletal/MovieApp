import { useMemo } from "react";
import "../css/FilterBar.css";

/**
 * Pretty filter bar with:
 * - Query (search handled in your form above, so optional here)
 * - Min rating (range slider)
 * - Year (number input)
 * - Genre (chips OR select)
 * - Sort (select)
 * Props are controlled by parent (Home.jsx)
 */
export default function FilterBar({
  searchActive,              // boolean: if true, show "search mode" note and disable discover filters
  minRating, setMinRating,
  year, setYear,
  genreId, setGenreId,
  genres = [],
  sortBy, setSortBy,
  onReset,                   // function: reset all filters
}) {
  // map for sort labels
  const sortOptions = useMemo(() => ([
    { value: "popularity.desc", label: "Popularity ↓" },
    { value: "vote_average.desc", label: "Rating ↓" },
    { value: "primary_release_date.desc", label: "Newest ↓" },
  ]), []);

  return (
    <div className="filterbar">
  <div className="filterbar__inner">
    <div className="field field--range">
      <label className="label">⭐ Min rating</label>
      <div className="range-wrap">
        <input type="range" min="0" max="9" step="1"
               value={minRating || 0}
               onChange={(e)=>setMinRating(e.target.value === "0" ? "" : e.target.value)} />
        <span className="range-value">{minRating ? `${minRating}+` : "All"}</span>
      </div>
    </div>

    <div className="field field--year">
  <label className="label">📅 Year</label>
  <input
    className="input"
    type="number"
    placeholder="e.g. 2020"
    value={year}
    onChange={(e) => setYear(e.target.value)}
    min="1900"
    max="2100"
  />
</div>

    <div className="field field--genres">
      <label className="label">🎭 Genre</label>
      <div className="chips">
        <div className="chips__scroll">
          <button type="button" className={`chip ${!genreId ? "chip--active" : ""}`} onClick={()=>setGenreId("")}>All</button>
          {genres.map(g => (
            <button type="button" key={g.id}
              className={`chip ${String(genreId)===String(g.id) ? "chip--active" : ""}`}
              onClick={()=>setGenreId(String(g.id))}>
              {g.name}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="field field--sort">
      <label className="label">↕ Sort</label>
      <select className="select" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
        <option value="popularity.desc">Popularity ↓</option>
        <option value="vote_average.desc">Rating ↓</option>
        <option value="primary_release_date.desc">Newest ↓</option>
      </select>
    </div>

    <div className="field field--reset">
      <button type="button" className="btn-reset" onClick={onReset}>Reset filters</button>
    </div>
  </div>
</div>
  );
}
