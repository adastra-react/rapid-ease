import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Content from "@/components/pages/terms/Content";
import PageHeader from "@/components/pages/terms/PageHeader";
import React from "react";
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description:
    "Read the RapidEase876 terms and conditions for tours, bookings, payments, cancellations, and travel services.",
  path: "/terms",
});

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <PageHeader />
        <Content />
        <FooterOne />
      </main>
    </>
  );
}
