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
  title: "RapidEase876 - Travel & Tour Services",
  description:
    "Welcome to RapidEase876, your ultimate travel and tour companion. Explore Jamaica with ease and comfort through our premium travel services.",
  keywords:
    "travel, tour, Jamaica, transportation, travel services, RapidEase876",
  authors: [{ name: "Suneil England" }],
  creator: "Suneil England",
  publisher: "RapidEase876",

  // Open Graph metadata for social sharing
  openGraph: {
    title: "RapidEase876 - Premium Travel & Tour Services",
    description:
      "Welcome to RapidEase876, your ultimate travel and tour companion. Explore Jamaica with ease and comfort through our premium travel services.",
    url: "https://rapidease876.com",
    siteName: "RapidEase876",
    images: [
      {
        url: "https://rapidease876.com/og-image.jpg", // Use full URL, not relative path
        width: 1200,
        height: 630,
        alt: "RapidEase876 - Premium Travel Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "RapidEase876 - Premium Travel & Tour Services",
    description:
      "Welcome to RapidEase876, your ultimate travel and tour companion. Explore Jamaica with ease and comfort.",
    creator: "@rapidease876", // Update with your actual Twitter handle
    images: ["https://rapidease876.com/og-image.jpg"],
  },

  // Favicon and app icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", sizes: "16x16", type: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#FF0000", // Use your brand red color
      },
    ],
  },

  // Additional metadata
  manifest: "/site.webmanifest",
  themeColor: "#FF0000", // Your brand red color
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        {/* Force refresh of metadata */}
        <meta property='og:updated_time' content={new Date().toISOString()} />
      </head>
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
