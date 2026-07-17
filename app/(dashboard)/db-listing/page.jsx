import DBListing from "@/components/dasboard/DBListing";
import React from "react";
import { buildNoIndexMetadata } from "@/app/lib/seo";

export const metadata = buildNoIndexMetadata({
  title: "Listed Tours",
  description: "Manage tours and listings in the RapidEase876 dashboard.",
  path: "/db-listing",
});

export default function page() {
  return (
    <>
      <main>
        <DBListing />
      </main>
    </>
  );
}
