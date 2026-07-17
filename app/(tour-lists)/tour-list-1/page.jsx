import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/tours/PageHeader";
import TourList1 from "@/components/tours/TourList1";
import React from "react";
import {
  buildBreadcrumbSchema,
  buildMetadata,
  buildTourListSchema,
} from "@/app/lib/seo";
import {
  getTours,
  hasActiveTourQuery,
  normalizeTourSearchParams,
} from "@/app/lib/tours";

function buildTourListPageCopy(searchParams = {}) {
  const normalized = normalizeTourSearchParams(searchParams);
  const location = normalized.location;
  const tourType = normalized.tourTypes?.[0];

  if (location && tourType) {
    return {
      title: `${location} ${tourType}`,
      description: `Browse ${tourType.toLowerCase()} available in ${location}, Jamaica with pricing, reviews, and booking details from RapidEase876.`,
    };
  }

  if (location) {
    return {
      title: `${location} Jamaica Tours`,
      description: `Browse tours, excursions, and transportation options in ${location}, Jamaica with RapidEase876.`,
    };
  }

  if (tourType) {
    return {
      title: `${tourType} in Jamaica`,
      description: `Browse ${tourType.toLowerCase()} across Jamaica with pricing, reviews, and booking details from RapidEase876.`,
    };
  }

  return {
    title: "Jamaica Tours and Excursions",
    description:
      "Browse Jamaica tours, attractions, and transportation options with filters for destination, tour type, and price.",
  };
}

export async function generateMetadata({ searchParams }) {
  const copy = buildTourListPageCopy(searchParams);

  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: "/tour-list-1",
    keywords: ["Jamaica excursions", "things to do in Jamaica"],
    index: !hasActiveTourQuery(searchParams),
  });
}

export default async function page({ searchParams }) {
  const initialData = await getTours(searchParams);
  const tours = initialData?.data?.tours || [];
  const copy = buildTourListPageCopy(searchParams);

  return (
    <>
      <main>
        <Header1 />
        <JsonLd
          data={buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tours", path: "/tour-list-1" },
          ])}
        />
        <JsonLd data={buildTourListSchema(tours, copy.title)} />
        <PageHeader searchParams={searchParams} />
        <TourList1 searchParams={searchParams} initialData={initialData} />
        <FooterOne />
      </main>
    </>
  );
}
