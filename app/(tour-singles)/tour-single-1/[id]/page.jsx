import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import PageHeader from "@/components/tourSingle/PageHeader";
import TourSlider from "@/components/tourSingle/TourSlider";
import SingleOne from "@/components/tourSingle/pages/SingleOne";
import { allTour } from "@/data/tours";
import React from "react";
import { buildMetadata } from "@/app/lib/seo";

export function generateMetadata({ params }) {
  const tour = allTour.find((item) => item.id == params.id) || allTour[0];

  return buildMetadata({
    title: tour?.title || "Jamaica Tour Details",
    description:
      tour?.description ||
      `View itinerary, pricing, and booking details for ${tour?.title || "this Jamaica tour"}.`,
    path: `/tour-single-1/${params.id}`,
    keywords: [tour?.location, tour?.feature].filter(Boolean),
    image: tour?.imageSrc || "/img/pageHeader/1.jpg",
  });
}

export default function page({ params }) {
  const id = params.id;
  const tour = allTour.find((item) => item.id == id) || allTour[0];

  return (
    <>
      <main>
        <Header1 />
        <PageHeader />
        <SingleOne tour={tour} />
        <TourSlider />
        <FooterOne />
      </main>
    </>
  );
}
