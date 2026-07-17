import React from "react";
import Firstpage from "./(homes)/home-1/page";
import { buildMetadata } from "./lib/seo";

export const metadata = buildMetadata({
  title: "Jamaica Tours, Excursions and Private Transfers",
  description:
    "Explore Jamaica with RapidEase876 through private transfers, curated excursions, and island experiences built for comfort and convenience.",
  path: "/",
  keywords: ["Jamaica travel services", "Jamaica private transfers"],
});

export default function page() {
  return (
    <>
      <Firstpage />
    </>
  );
}
