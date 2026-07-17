import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Login from "@/components/pages/Login";
import React from "react";
import { buildNoIndexMetadata } from "@/app/lib/seo";

export const metadata = buildNoIndexMetadata({
  title: "Log In",
  description:
    "Log in to your RapidEase876 account to manage bookings, listings, and account details.",
  path: "/login",
});

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <Login />
        <FooterOne />
      </main>
    </>
  );
}
