const socialMediaLinks = [
  { id: 1, class: "icon-facebook", href: "#" },
  { id: 2, class: "icon-twitter", href: "#" },
  { id: 3, class: "icon-instagram", href: "#" },
];

export default function Socials() {
  return (
    <>
      {socialMediaLinks.map((elm, i) => (
        <a key={i} href={elm.href} className={elm.class}></a>
      ))}
    </>
  );
}
