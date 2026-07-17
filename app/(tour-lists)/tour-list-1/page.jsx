import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import PageHeader from "@/components/tours/PageHeader";
import TourList1 from "@/components/tours/TourList1";
import React from "react";
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
  title: "Jamaica Tours and Excursions",
  description:
    "Browse Jamaica tours, attractions, and transportation options with filters for destination, tour type, and price.",
  path: "/tour-list-1",
  keywords: ["Jamaica excursions", "things to do in Jamaica"],
});

export default function page({ searchParams }) {
  return (
    <>
      <main>
        <Header1 />
        <PageHeader />
        <TourList1 searchParams={searchParams} />
        <FooterOne />
      </main>
    </>
  );
}
