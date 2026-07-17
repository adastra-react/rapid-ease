import ScrollToTop from "@/components/common/ScrollToTop";
import "../public/css/style.css";

import { DM_Sans } from "next/font/google";
import ScrollTopBehaviour from "@/components/common/ScrollTopBehavier";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import Wrapper from "@/components/layout/Wrapper";
import { ReduxProvider } from "./provider";
import { siteConfig } from "./lib/seo";

const dmsans = DM_Sans({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

if (typeof window !== "undefined") {
  import("bootstrap");
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF0000",
  colorScheme: "light",
};

export const metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  applicationName: siteConfig.siteName,
  keywords: siteConfig.keywords,
  authors: [{ name: "Suneil England" }],
  creator: "Suneil England",
  publisher: siteConfig.siteName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.defaultTitle,
      },
    ],
    locale: "en_JM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [siteConfig.defaultOgImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={dmsans.className}>
        <ReduxProvider>
          <CurrencyProvider>
            <Wrapper>
              <div className='page-transition'>
                <div className='page-transition__content'>{children}</div>
              </div>
            </Wrapper>
          </CurrencyProvider>
        </ReduxProvider>
        <ScrollToTop />
        <ScrollTopBehaviour />
      </body>
    </html>
  );
}
