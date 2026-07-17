import { allTour } from "@/data/tours";
import { absoluteUrl } from "./lib/seo";

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/destinations",
  "/terms",
  "/tour-list-1",
];

export default function sitemap() {
  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const tourEntries = allTour.map((tour) => ({
    url: absoluteUrl(`/tour-single-1/${tour.id}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...tourEntries];
}
