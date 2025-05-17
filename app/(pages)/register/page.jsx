import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Register from "@/components/pages/Register";
import React from "react";

export const metadata = {
  title: "Register || Rapid Ease - Travel & Tour React NextJS Template",
  description: "Rapid Ease - Travel & Tour React NextJS Template",
};

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <Register />
        <FooterOne />
      </main>
    </>
  );
}
