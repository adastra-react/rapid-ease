import DBListing from "@/components/dasboard/DBListing";
import React from "react";

export const metadata = {
  title:
    "Dashboard-listing || Rapid Ease - Travel & Tour React NextJS Template",
  description: "Rapid Ease - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <DBListing />
      </main>
    </>
  );
}
