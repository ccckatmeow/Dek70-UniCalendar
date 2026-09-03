"use client";

import { TCAS_ROUNDS } from "../lib/dateUtils";

export default function FilterBar({
  filters,
  onChange,
  knownUniversities,
  knownTags,
}) {
  const hasActiveFilters =
    filters.search || filters.university || filters.tcasRound || filters.tags.length > 0;

  function toggleTag(tag) {
    const active = filters.tags.includes(tag);
    const nextTags = active
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: nextTags });
  }

  function clearAll() {
    onChange({ search: "", university: "", tcasRound: "", tags: [] });
  }

  return (
    <div className="filter-bar">
      <input
        type="text"
        className="filter-bar__search"
        placeholder="ค้นชื่อกิจกรรม หรือมหาวิทยาลัย..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <div className="filter-bar__row">
        <select
          value={filters.university}
          onChange={(e) => onChange({ ...filters, university: e.target.value })}
        >
          <option value="">ทุกมหาวิทยาลัย</option>
          {knownUniversities.map((u) => (
            <option value={u} key={u}>
              {u}
            </option>
          ))}
        </select>

        <select
          value={filters.tcasRound}
          onChange={(e) => onChange({ ...filters, tcasRound: e.target.value })}
        >
          <option value="">ทุกรอบ TCAS</option>
          {TCAS_ROUNDS.map((r) => (
            <option value={r} key={r}>
              {r}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button type="button" className="filter-bar__clear" onClick={clearAll}>
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {knownTags.length > 0 && (
        <div className="filter-bar__tags">
          {knownTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`chip chip--filter ${
                filters.tags.includes(tag) ? "chip--active" : ""
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
