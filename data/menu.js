export const homes = [
  { id: 11, title: "Home 01", href: "/" },
];

export const tours = [
  {
    id: 21,
    title: "Tours",
    links: [
      { id: 211, title: "Browse tours", href: "/tour-list-1" },
      { id: 221, title: "Featured tour", href: "/tour-single-1/3" },
    ],
  },
];

export const pages = [
  {
    id: 51,
    title: "Dashboard",
    subnav: [
      { id: 511, title: "Dashboard", href: "/db-main" },
      { id: 512, title: "Dashboard booking", href: "/db-booking" },
      { id: 513, title: "Dashboard listings", href: "/db-listing" },
      { id: 514, title: "Dashboard add tour", href: "/db-add-tour" },
    ],
  },
  { id: 53, title: "Destinations", href: "/destinations" },
  { id: 54, title: "About", href: "/about" },
  { id: 56, title: "Terms", href: "/terms" },
  { id: 57, title: "Login", href: "/login" },
  { id: 58, title: "Register", href: "/register" },
];
