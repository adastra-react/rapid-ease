"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import api from "@/app/store/services/api";

const STORAGE_KEY = "re_recent_searches";
const MAX_RECENT = 5;
const DEBOUNCE_MS = 280;

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecent(tour) {
  try {
    const list = loadRecent().filter((r) => r.id !== tour.id);
    const updated = [
      { id: tour.id, title: tour.title, location: tour.location, imageSrc: tour.imageSrc },
      ...list,
    ].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export default function HeaderSerch({ white }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Load recent on mount (client only)
  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(timerRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setHighlighted(-1);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await api.get("/tours/search", { params: { q: query.trim() } });
        const tours = res.data?.data?.tours || [];
        setResults(tours.slice(0, 8));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setHighlighted(-1);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  const handleSelect = (tour) => {
    setRecent(saveRecent(tour));
    setOpen(false);
    setQuery("");
    router.push(`/tour-single-1/${tour.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    // If there's a highlighted item use it, otherwise go to search list
    if (highlighted >= 0 && results[highlighted]) {
      handleSelect(results[highlighted]);
    } else if (results.length === 1) {
      handleSelect(results[0]);
    } else {
      // Pass search term as location filter (works for destination/area searches)
      router.push(`/tour-list-1?search=hero&location=${encodeURIComponent(q)}`);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const list = query.trim() ? results : recent;
    if (!open || list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showRecent = open && !query.trim() && recent.length > 0;
  const showResults = open && query.trim().length > 0;
  const isOpen = showRecent || showResults;
  const activeList = query.trim() ? results : recent;

  return (
    <div
      ref={containerRef}
      className="header__search js-liverSearch js-form-dd"
    >
      <i className="icon-search text-18" />

      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search destinations or activities"
          className={`js-search ${white ? "text-white" : ""}`}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </form>

      <div
        className={isOpen ? "headerSearchRecent is-active" : "headerSearchRecent"}
        data-x="headerSearch"
      >
        <div className="headerSearchRecent__container">

          {/* ── Recent searches ─────────────────────────────── */}
          {showRecent && (
            <>
              <div className="headerSearchRecent__title">
                <h4 className="text-18 fw-500">Recent Searches</h4>
              </div>
              <div className="headerSearchRecent__list js-results">
                {recent.map((tour, i) => (
                  <button
                    key={tour.id}
                    onClick={() => handleSelect(tour)}
                    className={`headerSearchRecent__item js-search-option${highlighted === i ? " is-highlighted" : ""}`}
                    onMouseEnter={() => setHighlighted(i)}
                  >
                    <TourThumb tour={tour} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Live results ────────────────────────────────── */}
          {showResults && (
            <>
              <div className="headerSearchRecent__title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h4 className="text-18 fw-500">
                  {loading
                    ? "Searching…"
                    : results.length
                    ? `Tours (${results.length})`
                    : "No results found"}
                </h4>
                {!loading && results.length > 0 && (
                  <Link
                    href={`/tour-list-1?search=hero&location=${encodeURIComponent(query.trim())}`}
                    onClick={() => setOpen(false)}
                    style={{ fontSize: 13, color: "#ea3c3c", fontWeight: 600, textDecoration: "none" }}
                  >
                    See all →
                  </Link>
                )}
              </div>

              <div className="headerSearchRecent__list js-results">
                {loading ? (
                  <Skeletons />
                ) : results.length === 0 ? (
                  <div style={{ padding: "12px 0", color: "#94a3b8", fontSize: 14 }}>
                    Try a different keyword or destination.
                  </div>
                ) : (
                  results.map((tour, i) => (
                    <button
                      key={tour.id}
                      onClick={() => handleSelect(tour)}
                      className={`headerSearchRecent__item js-search-option${highlighted === i ? " is-highlighted" : ""}`}
                      onMouseEnter={() => setHighlighted(i)}
                    >
                      <TourThumb tour={tour} query={query} />
                    </button>
                  ))
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TourThumb({ tour, query }) {
  const imgSrc = tour.imageSrc || (tour.images?.[0]?.url) || null;
  return (
    <>
      <div className="size-50 bg-white rounded-12 border-1 flex-center overflow-hidden" style={{ flexShrink: 0 }}>
        {imgSrc ? (
          <Image
            width={50}
            height={50}
            src={imgSrc}
            alt={tour.title}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <i className="icon-pin text-20" />
        )}
      </div>
      <div className="ml-10" style={{ textAlign: "left", minWidth: 0 }}>
        <div className="fw-500 js-search-option-target" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <Highlight text={tour.title} query={query} />
        </div>
        <div className="lh-14 text-14 text-light-2">{tour.location}</div>
      </div>
    </>
  );
}

function Highlight({ text = "", query = "" }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "#fff3cd", padding: 0 }}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function Skeletons() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="headerSearchRecent__item" style={{ pointerEvents: "none" }}>
          <div className="size-50 rounded-12" style={{ background: "#f1f5f9", flexShrink: 0 }} />
          <div className="ml-10" style={{ flex: 1 }}>
            <div style={{ height: 14, width: "60%", background: "#f1f5f9", borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 11, width: "40%", background: "#f1f5f9", borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </>
  );
}
