import BannerOne from "@/components/homes/banners/BannerOne";
import BrandsOne from "@/components/homes/brands/BrandsOne";
import FeaturesOne from "@/components/homes/features/FeaturesOne";
import FeturesTwo from "@/components/homes/features/FeturesTwo";
import TestimonialOne from "@/components/homes/testimonials/TestimonialOne";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Hero from "@/components/pages/about/Hero";
import Information from "@/components/pages/about/Information";
import React from "react";
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
  title: "About RapidEase876",
  description:
    "Learn more about RapidEase876 and our mission to make Jamaica tours, transportation, and travel planning simpler for every guest.",
  path: "/about",
});

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <Hero />
        <Information />
        {/* <Banner /> */}
        <FeaturesOne />
        <div className='mt-60'>
          <FeturesTwo />
        </div>
        <TestimonialOne />
        <BannerOne />
        {/* <Team /> */}
        <BrandsOne />
        <FooterOne />
      </main>
    </>
  );
}
