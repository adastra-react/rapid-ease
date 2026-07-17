import React from "react";
import Messages from "@/components/dasboard/Messages";
import { buildNoIndexMetadata } from "@/app/lib/seo";

export const metadata = buildNoIndexMetadata({
  title: "Dashboard Messages",
  description: "Review contact form inquiries in the RapidEase876 dashboard.",
  path: "/db-messages",
});

export default function page() {
  return (
    <main>
      <Messages />
    </main>
  );
}
