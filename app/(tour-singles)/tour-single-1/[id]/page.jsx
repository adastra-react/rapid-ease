import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/tourSingle/PageHeader";
import TourSlider from "@/components/tourSingle/TourSlider";
import SingleOne from "@/components/tourSingle/pages/SingleOne";
import React from "react";
import { notFound } from "next/navigation";
import { getFaqData } from "@/data/tourSingleContent";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildMetadata,
  buildTourSchema,
} from "@/app/lib/seo";
import { getTourById } from "@/app/lib/tours";

export async function generateMetadata({ params }) {
  const tour = await getTourById(params.id);

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

export default async function page({ params }) {
  const tour = await getTourById(params.id);

  if (!tour) {
    notFound();
  }

  const faqItems = getFaqData(tour);

  return (
    <>
      <main>
        <Header1 />
        <JsonLd
          data={buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tours", path: "/tour-list-1" },
            { name: tour?.title || "Tour Details", path: `/tour-single-1/${params.id}` },
          ])}
        />
        <JsonLd data={buildTourSchema(tour)} />
        <JsonLd data={buildFaqSchema(faqItems)} />
        <PageHeader tour={tour} />
        <SingleOne tour={tour} />
        <TourSlider />
        <FooterOne />
      </main>
    </>
  );
}
