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
  title: "Your Site Title",
  description:
    "Your site description that will appear when shared on social media",
  keywords: "your, keywords, here",
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Company",

  // Open Graph metadata for social sharing
  openGraph: {
    title: "Your Site Title",
    description: "Your site description for social sharing",
    url: "https://yourwebsite.com",
    siteName: "Your Site Name",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg", // Replace with your image URL
        width: 1200,
        height: 630,
        alt: "Your site preview image",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Your Site Title",
    description: "Your site description for Twitter",
    creator: "@yourtwitterhandle",
    images: ["https://yourwebsite.com/og-image.jpg"], // Same image as OG
  },

  // Favicon and app icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
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
