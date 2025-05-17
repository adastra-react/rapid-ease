import DbBooking from "@/components/dasboard/DbBooking";
import React from "react";

export const metadata = {
  title:
    "Dashboard-booking || Rapid Ease - Travel & Tour React NextJS Template",
  description: "Rapid Ease - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <DbBooking />
      </main>
    </>
  );
}
