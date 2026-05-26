export const included = [
  { id: 1, text: "Beverages, drinking water, morning tea and buffet lunch" },
  { id: 2, text: "Local taxes" },
  { id: 3, text: "Hotel pickup and drop-off by air-conditioned minivan" },
  { id: 4, text: "InsuranceTransfer to a private pier" },
  { id: 5, text: "Soft drinks" },
  { id: 6, text: "Tour Guide" },
];

export const excluded = [
  { id: 7, text: "Towel" },
  { id: 8, text: "Tips" },
  { id: 9, text: "Alcoholic Beverages" },
];

export const roadmapData = [
  { id: 1, icon: "icon-pin", title: "Day 1: Airport Pick Up" },
  {
    id: 2,
    title: "Day 2: Temples & River Cruise",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
  { id: 3, title: "Day 3: Massage & Overnight Train" },
  { id: 4, title: "Day 4: Khao Sok National Park" },
  { id: 5, title: "Day 5: Travel to Koh Phangan" },
  { id: 6, title: "Day 6: Morning Chill & Muay Thai Lesson" },
  { id: 7, icon: "icon-flag", title: "Day 7: Island Boat Trip" },
];

export const roadmapData2 = [
  {
    id: 1,
    icon: "icon-pin",
    title: "Day 1: Airport Pick Up",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
  {
    id: 2,
    title: "Day 2: Temples & River Cruise",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
  {
    id: 3,
    title: "Day 3: Massage & Overnight Train",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
  {
    id: 4,
    title: "Day 4: Khao Sok National Park",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
  {
    id: 5,
    title: "Day 5: Travel to Koh Phangan",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
  {
    id: 6,
    title: "Day 6: Morning Chill & Muay Thai Lesson",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
  {
    id: 7,
    icon: "icon-flag",
    title: "Day 7: Island Boat Trip",
    content:
      "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
  },
];

export const getFaqData = (tour) => {
  const tourName = tour?.title || "this experience";
  const location = tour?.location || "the listed destination";
  const duration = tour?.duration || "the time shown on the page";

  return [
    {
      question: "What information is included on each tour page?",
      answer: `Every Rapid Ease tour page is designed to help you book with confidence. For ${tourName}, you can review the overview, location, duration, pricing, photos, and the main inclusions before making your booking.`,
    },
    {
      question: "What is usually included with this tour?",
      answer: `Inclusions can vary by experience, so we recommend checking the "What's included" section on the page for ${tourName}. That section highlights what is covered in your booking and helps you see if anything extra should be planned for in advance.`,
    },
    {
      question: "Do you offer pickup, drop-off, or airport transfers?",
      answer: `Many Rapid Ease experiences can be paired with pickup, drop-off, or airport transfer support depending on the tour and your plans in ${location}. If you need transportation arranged around ${tourName}, contact us and we can confirm the best option for you.`,
    },
    {
      question: "What if I do not see the exact tour or service I need on the website?",
      answer: `If the website does not show exactly what you are looking for, reach out to the Rapid Ease team directly. We can help with custom requests, private rides, special schedules, and recommendations related to ${tourName} or other experiences that may not be listed online yet.`,
    },
    {
      question: "Can I ask questions before I book?",
      answer: `Yes. If you want help deciding whether ${tourName} is the right fit, or need clarification about timing, meeting details, or availability, just contact us before booking. We are happy to guide you based on your travel plans and the listed duration of ${duration}.`,
    },
  ];
};

export const faqData = getFaqData();

export const overallRatingData = [
  {
    id: 1,
    category: "Overall Rating",
    icon: "icon-star-2",
    rating: "5.0",
    comment: "Excellent",
  },
  {
    id: 2,
    category: "Location",
    icon: "icon-pin-2",
    rating: "5.0",
    comment: "Excellent",
  },
  {
    id: 3,
    category: "Amenities",
    icon: "icon-application",
    rating: "5.0",
    comment: "Excellent",
  },
  {
    id: 4,
    category: "Food",
    icon: "icon-utensils",
    rating: "5.0",
    comment: "Excellent",
  },
  {
    id: 5,
    category: "Price",
    icon: "icon-price-tag",
    rating: "5.0",
    comment: "Excellent",
  },
  {
    id: 6,
    category: "Rooms",
    icon: "icon-bed-2",
    rating: "5.0",
    comment: "Excellent",
  },
  {
    id: 7,
    category: "Tour Operator",
    icon: "icon-online-support-2",
    rating: "5.0",
    comment: "Excellent",
  },
];

export const reviews = [
  {
    id: 1,
    avatar: "/img/reviews/avatars/1.png",
    name: "Ali Tufan",
    date: "April 2023",
    stars: 5,
    reviewText: "Take this tour! Its fantastic!",
    desc: `Great for 4-5 hours to explore. Really a lot to see and tons of photo spots. Even have a passport for you to collect all the stamps as a souvenir. Must see for a Harry Potter fan.`,
    images: [
      "/img/reviews/1/1.png",
      "/img/reviews/1/2.png",
      "/img/reviews/1/3.png",
    ],
  },
  {
    id: 2,
    avatar: "/img/reviews/avatars/1.png",
    name: "Ali Tufan",
    date: "April 2023",
    stars: 5,
    reviewText: "Take this tour! Its fantastic!",
    desc: `Great for 4-5 hours to explore. Really a lot to see and tons of photo spots. Even have a passport for you to collect all the stamps as a souvenir. Must see for a Harry Potter fan.`,
    images: [
      "/img/reviews/1/1.png",
      "/img/reviews/1/2.png",
      "/img/reviews/1/3.png",
    ],
  },
  {
    id: 3,
    avatar: "/img/reviews/avatars/1.png",
    name: "Ali Tufan",
    date: "April 2023",
    stars: 5,
    reviewText: "Take this tour! Its fantastic!",
    desc: `Great for 4-5 hours to explore. Really a lot to see and tons of photo spots. Even have a passport for you to collect all the stamps as a souvenir. Must see for a Harry Potter fan.`,
    images: [
      "/img/reviews/1/1.png",
      "/img/reviews/1/2.png",
      "/img/reviews/1/3.png",
    ],
  },
  // More review objects can be added to this array
];

export const times = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
