import DbBooking from "@/components/dasboard/DbBooking";
import React from "react";
import { buildNoIndexMetadata } from "@/app/lib/seo";

export const metadata = buildNoIndexMetadata({
  title: "My Bookings",
  description: "Review and manage your RapidEase876 bookings.",
  path: "/db-booking",
});

export default function page() {
  return (
    <>
      <main>
        <DbBooking />
      </main>
    </>
  );
}
