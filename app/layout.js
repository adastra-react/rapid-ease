import ScrollToTop from "@/components/common/ScrollToTop";
import "../public/css/style.css";

import { DM_Sans } from "next/font/google";
import ScrollTopBehaviour from "@/components/common/ScrollTopBehavier";
import Wrapper from "@/components/layout/Wrapper";
import { ReduxProvider } from "./provider";

const dmsans = DM_Sans({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

if (typeof window !== "undefined") {
  import("bootstrap");
}

// Add your metadata here
export const metadata = {
  title: "RapicEase876 - Travel & Tour",
  description:
    "Welcome to RapidEase876, your ultimate travel and tour companion. Explore the world with ease and comfort.",
  keywords: "your, keywords, here",
  authors: [{ name: "Your Name" }],
  creator: "Suneil England",
  publisher: "RapidEase876",

  // Open Graph metadata for social sharing
  openGraph: {
    title: "RapidEase876",
    description: "",
    url: "https://rapidease876.com",
    siteName: "Your Site Name",
    images: [
      {
        url: "/app/favicon.svg", // Replace with your image URL
        width: 1200,
        height: 630,
        alt: "Your site preview image",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card metadata
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Your Site Title",
  //   description: "Your site description for Twitter",
  //   creator: "@yourtwitterhandle",
  //   images: ["https://yourwebsite.com/og-image.jpg"], // Same image as OG
  // },

  // Favicon and app icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/ico" },
      { url: "/favicon.svg", sizes: "32x32", type: "image/svg" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000", // Your brand color
      },
    ],
  },

  // Additional metadata
  manifest: "/site.webmanifest",
  themeColor: "#ffffff", // Your brand color
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head></head>
      <body className={dmsans.className}>
        <ReduxProvider>
          <Wrapper>
            <div className='page-transition'>
              <div className='page-transition__content'>{children}</div>
            </div>
          </Wrapper>
        </ReduxProvider>
        <ScrollToTop />
        <ScrollTopBehaviour />
      </body>
    </html>
  );
}
