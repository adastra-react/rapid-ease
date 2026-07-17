import DBMain from "@/components/dasboard/main";
import React from "react";
import { buildNoIndexMetadata } from "@/app/lib/seo";

export const metadata = buildNoIndexMetadata({
  title: "Dashboard",
  description:
    "Manage bookings, listings, and account activity in the RapidEase876 dashboard.",
  path: "/db-main",
});

export default function page() {
  return (
    <>
      <main>
        <DBMain />
      </main>
    </>
  );
}
