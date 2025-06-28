"use client";
import FooterOne from "@/components/layout/footers/FooterOne";
import Header1 from "@/components/layout/header/Header1";
import Hero1 from "@/components/blogs/Hero1";
import BlogSingle from "@/components/blogs/BlogSingle";
import { blogs } from "@/data/blogs";

export default function page({ params }) {
  const id = params.id;
  const blog = blogs.find((item) => item.id == id) || blogs[0];

  return (
    <>
      <main>
        <Header1 />
        <Hero1 blog={blog} />
        <BlogSingle />
        <FooterOne />
      </main>
    </>
  );
}
