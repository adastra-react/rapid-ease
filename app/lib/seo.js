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
  contactEmail: "rapidease876@gmail.com",
  telephone: "+1-876-301-3546",
  addressLocality: "Montego Bay",
  addressCountry: "JM",
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

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl("/img/general/logo-3.png"),
    email: siteConfig.contactEmail,
    telephone: siteConfig.telephone,
    areaServed: "Jamaica",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.addressLocality,
      addressCountry: siteConfig.addressCountry,
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "en-JM",
  };
}

export function buildBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildTourListSchema(tours = [], title = "Jamaica Tours") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/tour-single-1/${tour.id || tour._id}`),
      name: tour.title,
    })),
  };
}

export function buildFaqSchema(items = []) {
  if (!items.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildTourSchema(tour) {
  if (!tour) {
    return null;
  }

  const tourUrl = absoluteUrl(`/tour-single-1/${tour.id || tour._id}`);
  const offerPrice = tour?.pricing?.basePrice || tour?.price || 0;
  const reviewCount = Number(tour?.ratingCount || tour?.reviews?.length || 0);
  const aggregateRating =
    reviewCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: Number(tour.rating || 0).toFixed(1),
          reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.description || tour.overview || defaultDescription,
    url: tourUrl,
    image: [
      absoluteUrl(tour.imageSrc || defaultOgImage),
      ...(Array.isArray(tour.images)
        ? tour.images
            .map((image) => image?.url)
            .filter(Boolean)
            .map((image) => absoluteUrl(image))
        : []),
    ],
    touristType: tour.adultOnly ? "Adults" : "General Audience",
    itinerary: Array.isArray(tour.itinerary)
      ? tour.itinerary.map((stop) => stop.title).filter(Boolean)
      : undefined,
    offers: {
      "@type": "Offer",
      url: tourUrl,
      priceCurrency: "USD",
      price: offerPrice,
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "TravelAgency",
      name: siteName,
      url: siteUrl,
    },
    aggregateRating,
  };
}
