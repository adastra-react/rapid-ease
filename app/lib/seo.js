const siteUrl = "https://rapidease876.com";
const siteName = "RapidEase876";
const defaultTitle = "RapidEase876 | Jamaica Tours, Excursions & Transfers";
const defaultDescription =
  "Book Jamaica tours, excursions, airport transfers, and private transportation with RapidEase876.";
const defaultOgImage = "/img/pageHeader/1.jpg";

export const siteConfig = {
  siteUrl,
  siteName,
  defaultTitle,
  defaultDescription,
  defaultOgImage,
  keywords: [
    "Jamaica tours",
    "Jamaica excursions",
    "Montego Bay transfers",
    "private driver Jamaica",
    "airport transfers Jamaica",
    "RapidEase876",
  ],
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
  keywords = [],
  image = defaultOgImage,
  index = true,
} = {}) {
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const canonical = absoluteUrl(path);
  const mergedKeywords = [...siteConfig.keywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical,
    },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      locale: "en_JM",
      type: "website",
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export function buildNoIndexMetadata(options = {}) {
  return buildMetadata({
    ...options,
    index: false,
  });
}
