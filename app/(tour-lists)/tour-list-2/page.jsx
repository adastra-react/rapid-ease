import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import PageHeader from "@/components/tours/PageHeader";
import TourList2 from "@/components/tours/TourList2";
import TourTypes from "@/components/tours/TourTypes";
import React from "react";

export const metadata = {
  title: "Tour-list-2 || Rapid Ease - Travel & Tour React NextJS Template",
  description: "Rapid Ease - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <PageHeader />

        <TourList2 />
        <FooterOne />
      </main>
    </>
  );
}
