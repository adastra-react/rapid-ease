import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import ContactForm from "@/components/pages/contact/ContactForm";
import Locations from "@/components/pages/contact/Locations";
import Map from "@/components/pages/contact/Map";
import React from "react";
import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
  title: "Contact RapidEase876",
  description:
    "Contact RapidEase876 to book Jamaica tours, airport transfers, private rides, or get help planning your next island experience.",
  path: "/contact",
});

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <Map />
        <Locations />
        <ContactForm />

        <FooterOne />
      </main>
    </>
  );
}
