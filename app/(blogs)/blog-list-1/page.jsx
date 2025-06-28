"use client";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Hero1 from "@/components/blogs/Hero1";
import BlogList1 from "@/components/blogs/BlogList1";

export default function page() {
  return (
    <>
      <main>
        <Header1 />
        <Hero1 />
        <BlogList1 />
        <FooterOne />
      </main>
    </>
  );
}
