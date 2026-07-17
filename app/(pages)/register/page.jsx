import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Register from "@/components/pages/Register";
import React from "react";
import { buildNoIndexMetadata } from "@/app/lib/seo";

export const metadata = buildNoIndexMetadata({
  title: "Create an Account",
  description:
    "Create a RapidEase876 account to manage tours, bookings, and future travel plans.",
  path: "/register",
});

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <Register />
        <FooterOne />
      </main>
    </>
  );
}
