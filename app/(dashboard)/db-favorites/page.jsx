import Favorites from "@/components/dasboard/Fevorite";
import React from "react";

export const metadata = {
  title:
    "Dashboard-favorites || Rapid Ease - Travel & Tour React NextJS Template",
  description: "Rapid Ease - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <Favorites />
      </main>
    </>
  );
}
