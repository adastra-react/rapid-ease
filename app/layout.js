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
