"use client";

import { sidebarItems } from "@/data/dashboard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const socialMediaLinks = [
  { id: 1, class: "icon-facebook", href: "#" },
  { id: 2, class: "icon-twitter", href: "#" },
  { id: 3, class: "icon-instagram", href: "#" },
  { id: 4, class: "icon-linkedin", href: "#" },
];

const primaryLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "tours", label: "Browse Tours", href: "/tour-list-1" },
  { id: "contact", label: "Contact", href: "/contact" },
];

const dashboardLinks = sidebarItems.filter(
  (item) => item.href.startsWith("/db-") && item.label !== "Logout"
);

export default function MobileMenu({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isActive = (href) => pathname === href;

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleDashboardNavigation = (href) => {
    closeMenu();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }

    router.push(href);
  };

  return (
    <div
      data-aos='fade'
      data-aos-delay=''
      className={`menu js-menu ${mobileMenuOpen ? "-is-active" : ""} `}
      style={
        mobileMenuOpen
          ? { opacity: "1", visibility: "visible" }
          : { pointerEvents: "none", visibility: "hidden" }
      }>
      <div onClick={closeMenu} className='menu__overlay js-menu-button'></div>

      <div className='menu__container'>
        <div className='menu__header'>
          <div>
            <h4>{isAuthenticated ? "Navigation" : "Menu"}</h4>
            <div className='text-14 text-light-2 mt-5'>
              {isAuthenticated
                ? "Quick access to site and dashboard pages."
                : "Browse the site or sign in to manage bookings and listings."}
            </div>
          </div>

          <button onClick={closeMenu} className='js-menu-button'>
            <i className='icon-cross text-10'></i>
          </button>
        </div>

        <div className='menu__content'>
          <div
            className='menuNav -is-active'
            style={{ maxHeight: "calc(100vh - 262px)", overflowY: "auto" }}>
            <div className='px-30 pt-10 pb-15'>
              <div className='text-14 fw-500 text-light-2 uppercase'>
                Explore
              </div>
            </div>

            <ul className='menuNav__list'>
              {primaryLinks.map((item) => (
                <li key={item.id} className='menuNav__item'>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={isActive(item.href) ? "activeMenu" : ""}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className='px-30 pt-25 pb-10'>
              <div className='text-14 fw-500 text-light-2 uppercase'>
                {isAuthenticated ? "Dashboard" : "Account"}
              </div>
              <div className='text-14 text-light-2 mt-5'>
                {isAuthenticated
                  ? "Manage bookings, listings, and tours."
                  : "Sign in first to open your dashboard tools."}
              </div>
            </div>

            <ul className='menuNav__list'>
              {dashboardLinks.map((item) => (
                <li key={item.id} className='menuNav__item'>
                  <button
                    type='button'
                    onClick={() => handleDashboardNavigation(item.href)}
                    className={`menuNav__button ${
                      isActive(item.href) ? "activeMenu" : ""
                    }`}>
                    <span className='d-flex items-center'>
                      <i className={`${item.iconClass} mr-10`}></i>
                      {item.label}
                    </span>
                    {!isAuthenticated && (
                      <span className='text-12 text-light-2'>Sign in</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='menu__footer'>
          <i className='icon-headphone text-50'></i>

          <div className='text-20 lh-12 fw-500 mt-20'>
            <div>Speak to our expert at</div>
            <div className='text-accent-1'>1-800-453-6744</div>
          </div>

          <div className='d-flex items-center x-gap-10 pt-30'>
            {socialMediaLinks.map((elm) => (
              <div key={elm.id}>
                <a href={elm.href} className='d-block'>
                  <i className={elm.class}></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
