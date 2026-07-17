import Banner from "@/components/homes/banners/Banner";
import BannerOne from "@/components/homes/banners/BannerOne";
import Hero1 from "@/components/homes/heros/Hero1";
import TestimonialOne from "@/components/homes/testimonials/TestimonialOne";
import Tour1 from "@/components/homes/tours/Tour1";
import TourSlderOne from "@/components/homes/tours/TourSlderOne";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
      <Header1 />
      <Hero1 />
      {/* <FeaturesOne /> */}
      <Banner />
      {/* <DestinationsOne /> */}
      <Tour1 />
      {/* <TourTypeOne /> */}
      <TourSlderOne />
      <BannerOne />
      <TestimonialOne />
      {/* <ArticlesThree /> */}
      <FooterOne />
    </main>
  );
}
