import { cache } from "react";
import { allTour } from "@/data/tours";

const DEFAULT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://rapid-ease-server.vercel.app/api"
    : "http://localhost:5000/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
const DEFAULT_PAGE_SIZE = 10;

const arrayKeys = ["tourTypes", "languages", "ratings", "specials"];

const scalarKeys = [
  "location",
  "sort",
  "featured",
  "adultOnly",
  "minPrice",
  "maxPrice",
  "minDuration",
  "maxDuration",
  "minRating",
  "maxRating",
  "page",
  "limit",
];

function normalizeArrayValue(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeTourSearchParams(searchParams = {}) {
  const normalized = {};

  arrayKeys.forEach((key) => {
    const values = normalizeArrayValue(searchParams[key]);
    if (values.length > 0) {
      normalized[key] = values;
    }
  });

  scalarKeys.forEach((key) => {
    const value = searchParams[key];

    if (value === undefined || value === null || value === "") {
      return;
    }

    normalized[key] = String(value).trim();
  });

  if (!normalized.tourTypes?.length && searchParams.tourType) {
    normalized.tourTypes = normalizeArrayValue(searchParams.tourType);
  }

  if (!normalized.limit) {
    normalized.limit = String(DEFAULT_PAGE_SIZE);
  }

  if (!normalized.page) {
    normalized.page = "1";
  }

  return normalized;
}

export function buildTourRequestParams(searchParams = {}) {
  const normalized = normalizeTourSearchParams(searchParams);
  const params = new URLSearchParams();

  Object.entries(normalized).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(","));
      }
      return;
    }

    if (value !== "") {
      params.set(key, value);
    }
  });

  return params;
}

export function buildInitialTourFilters(searchParams = {}) {
  const normalized = normalizeTourSearchParams(searchParams);

  return {
    location: normalized.location || "",
    tourTypes: normalized.tourTypes || [],
    languages: normalized.languages || [],
    ratings: normalized.ratings || [],
    specials: normalized.specials || [],
    sort: normalized.sort || "-id",
    featured: normalized.featured || "",
    adultOnly: normalized.adultOnly || "",
    minPrice: normalized.minPrice ? Number(normalized.minPrice) : 0,
    maxPrice: normalized.maxPrice ? Number(normalized.maxPrice) : 100000,
    minDuration: normalized.minDuration ? Number(normalized.minDuration) : null,
    maxDuration: normalized.maxDuration ? Number(normalized.maxDuration) : null,
    minRating: normalized.minRating ? Number(normalized.minRating) : null,
    maxRating: normalized.maxRating ? Number(normalized.maxRating) : null,
  };
}

export function hasActiveTourQuery(searchParams = {}) {
  const normalized = normalizeTourSearchParams(searchParams);

  return Object.entries(normalized).some(([key, value]) => {
    if (key === "page") return value !== "1";
    if (key === "limit") return value !== String(DEFAULT_PAGE_SIZE);
    if (Array.isArray(value)) return value.length > 0;
    return value !== "";
  });
}

function fallbackTourMatchesQuery(tour, normalizedSearchParams) {
  const queryLocation = normalizedSearchParams.location?.toLowerCase();
  const queryTourTypes = normalizedSearchParams.tourTypes || [];

  if (
    queryLocation &&
    !tour.location?.toLowerCase().includes(queryLocation)
  ) {
    return false;
  }

  if (queryTourTypes.length > 0) {
    const haystack = [
      tour.title,
      tour.location,
      tour.description,
      tour.overview,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesTourType = queryTourTypes.some((tourType) =>
      haystack.includes(tourType.toLowerCase().replace(" tours", "").trim()),
    );

    if (!matchesTourType) {
      return false;
    }
  }

  return true;
}

function buildFallbackToursResponse(searchParams = {}) {
  const normalized = normalizeTourSearchParams(searchParams);
  const page = Number(normalized.page || 1);
  const limit = Number(normalized.limit || DEFAULT_PAGE_SIZE);
  const filteredTours = allTour.filter((tour) =>
    fallbackTourMatchesQuery(tour, normalized),
  );
  const start = (page - 1) * limit;
  const tours = filteredTours.slice(start, start + limit);

  return {
    status: "success",
    results: tours.length,
    totalTours: filteredTours.length,
    totalPages: Math.max(1, Math.ceil(filteredTours.length / limit)),
    currentPage: page,
    data: {
      tours,
    },
  };
}

export async function getTours(searchParams = {}) {
  const params = buildTourRequestParams(searchParams);
  const requestUrl = `${API_BASE_URL}/tours${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  try {
    const response = await fetch(requestUrl, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tours: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Falling back to local tours data:", error);
    return buildFallbackToursResponse(searchParams);
  }
}

export const getTourById = cache(async (id) => {
  const requestUrl = `${API_BASE_URL}/tours/single/${id}`;

  try {
    const response = await fetch(requestUrl, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tour ${id}: ${response.status}`);
    }

    const payload = await response.json();
    return payload?.data?.tour || null;
  } catch (error) {
    console.error("Falling back to local tour data:", error);
    return allTour.find((tour) => String(tour.id) === String(id)) || null;
  }
});
