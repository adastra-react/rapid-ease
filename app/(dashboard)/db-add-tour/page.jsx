import AddTour from "@/components/dasboard/AddTour";
import React from "react";
import { buildNoIndexMetadata } from "@/app/lib/seo";

export const metadata = buildNoIndexMetadata({
  title: "Add Tour",
  description: "Create and publish a new tour from the RapidEase876 dashboard.",
  path: "/db-add-tour",
});

export default function page() {
  return (
    <>
      <main>
        <AddTour />
      </main>
    </>
  );
}
