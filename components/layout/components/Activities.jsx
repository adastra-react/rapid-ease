"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const activityGroups = [
  {
    label: "Beach & Water",
    description: "Popular beaches, lagoons, and easy water days.",
    featured: [
      { name: "Doctor's Cave Beach", href: "/tour-list-1?search=header&location=St.%20James" },
      { name: "Seven Mile Beach", href: "/tour-list-1?search=header&location=Negril" },
      { name: "Blue Lagoon Tours", href: "/tour-list-1?search=header&location=Portland" },
      { name: "Luminous Lagoon", href: "/tour-list-1?search=header&location=Falmouth" },
    ],
    destinations: [
      { name: "Montego Bay", href: "/tour-list-1?search=header&location=Montego%20Bay" },
      { name: "Negril", href: "/tour-list-1?search=header&location=Negril" },
      { name: "Ocho Rios", href: "/tour-list-1?search=header&location=Ocho%20Rios" },
      { name: "Discovery Bay", href: "/tour-list-1?search=header&location=Discovery%20Bay" },
    ],
  },
  {
    label: "Culture & Heritage",
    description: "Museums, great houses, history, and local culture.",
    featured: [
      { name: "Bob Marley Museum", href: "/tour-list-1?search=header&location=Kingston" },
      { name: "Rose Hall Great House", href: "/tour-list-1?search=header&location=Rose%20Hall" },
      { name: "Devon House", href: "/tour-list-1?search=header&location=Kingston" },
      { name: "Appleton Estate", href: "/tour-list-1?search=header&tourType=Cultural%20Tours" },
    ],
    destinations: [
      { name: "Kingston", href: "/tour-list-1?search=header&location=Kingston" },
      { name: "St. James", href: "/tour-list-1?search=header&location=St.%20James" },
      { name: "South Coast", href: "/tour-list-1?search=header&tourType=Cultural%20Tours" },
      { name: "Port Royal", href: "/tour-list-1?search=header&tourType=Cultural%20Tours" },
    ],
  },
  {
    label: "Adventure & Nature",
    description: "Falls, caves, rafting, and nature-heavy day trips.",
    featured: [
      { name: "Dunn's River Falls", href: "/tour-list-1?search=header&location=Ocho%20Rios" },
      { name: "Green Grotto Caves", href: "/tour-list-1?search=header&location=Discovery%20Bay" },
      { name: "YS Falls", href: "/tour-list-1?search=header&tourType=Adventure%20Tours" },
      { name: "River Rafting", href: "/tour-list-1?search=header&tourType=Nature%20Tours" },
    ],
    destinations: [
      { name: "Ocho Rios", href: "/tour-list-1?search=header&location=Ocho%20Rios" },
      { name: "Discovery Bay", href: "/tour-list-1?search=header&location=Discovery%20Bay" },
      { name: "Hopewell", href: "/tour-list-1?search=header&location=Hopewell" },
      { name: "Blue Mountains", href: "/tour-list-1?search=header&tourType=Nature%20Tours" },
    ],
  },
  {
    label: "Food & Nightlife",
    description: "Local flavors, nightlife, and evening experiences.",
    featured: [
      { name: "Scotchies Stop", href: "/tour-list-1?search=header&location=St.%20James" },
      { name: "Hip Strip Evenings", href: "/tour-list-1?search=header&location=Montego%20Bay" },
      { name: "Rum Tasting", href: "/tour-list-1?search=header&tourType=Food%20Tours" },
      { name: "Sunset Dinner Spots", href: "/tour-list-1?search=header&tourType=Food%20Tours" },
    ],
    destinations: [
      { name: "Montego Bay", href: "/tour-list-1?search=header&location=Montego%20Bay" },
      { name: "Kingston", href: "/tour-list-1?search=header&location=Kingston" },
      { name: "Negril", href: "/tour-list-1?search=header&location=Negril" },
      { name: "South Coast", href: "/tour-list-1?search=header&tourType=Food%20Tours" },
    ],
  },
  {
    label: "Transfers & Land Tours",
    description: "Airport transfers, private rides, and easy island transport.",
    featured: [
      { name: "Airport Transfers", href: "/tour-list-1?search=header&location=Montego%20Bay" },
      { name: "Private Driver", href: "/tour-list-1?search=header&tourType=City%20Tours" },
      { name: "Hotel Transfers", href: "/tour-list-1?search=header&location=Kingston" },
      { name: "Round-Trip Ride", href: "/tour-list-1?search=header&tourType=City%20Tours" },
    ],
    destinations: [
      { name: "Montego Bay", href: "/tour-list-1?search=header&location=Montego%20Bay" },
      { name: "Kingston", href: "/tour-list-1?search=header&location=Kingston" },
      { name: "St. James", href: "/tour-list-1?search=header&location=St.%20James" },
      { name: "Negril", href: "/tour-list-1?search=header&location=Negril" },
    ],
  },
];

export default function Activities() {
  const [currentdd, setCurrentdd] = useState("");
  const [activeGroupLabel, setActiveGroupLabel] = useState(activityGroups[0].label);
  const dropDownContainer = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setCurrentdd("");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const activeGroup = useMemo(
    () =>
      activityGroups.find((group) => group.label === activeGroupLabel) ||
      activityGroups[0],
    [activeGroupLabel]
  );

  return (
    <div
      ref={dropDownContainer}
      className='headerDropdown lg:d-none js-form-dd'>
      <div
        className='headerDropdown__button'
        onClick={() =>
          setCurrentdd((pre) => (pre === "activities" ? "" : "activities"))
        }>
        Activities
        <i className='icon-chevron-down text-18'></i>
      </div>

      <div
        className={`headerDropdown__content ${
          currentdd === "activities" ? "is-active" : ""
        } `}>
        <div className='tabsMenu'>
          <div className='tabsMenu__container'>
            <div className='tabs js-tabs'>
              <div className='tabsMenu__tabs'>
                <div className='tabs__controls js-tabs-controls'>
                  {activityGroups.map((group) => (
                    <button
                      key={group.label}
                      onClick={() => setActiveGroupLabel(group.label)}
                      className={`tabs__button js-tabs-button ${
                        activeGroupLabel === group.label ? "is-tab-el-active" : ""
                      } `}>
                      {group.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className='tabsMenu__content'>
                <div className='tabs__content js-tabs-content'>
                  <div className='tabs__pane -tab-item-1 is-tab-el-active'>
                    <div className='px-30 pt-25 pb-10'>
                      <div className='text-18 fw-500'>{activeGroup.label}</div>
                      <div className='text-14 text-light-2 mt-5'>
                        {activeGroup.description}
                      </div>
                    </div>

                    <div className='tabsMenu__lists'>
                      <div className='tabsMenu-list'>
                        <div className='tabsMenu-list__title'>Popular Picks</div>
                        <div className='tabsMenu-list__content'>
                          {activeGroup.featured.map((item) => (
                            <div key={item.name} className='tabsMenu-list__item'>
                              <Link href={item.href} onClick={() => setCurrentdd("")}>
                                {item.name}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='tabsMenu-list'>
                        <div className='tabsMenu-list__title'>Browse By Area</div>
                        <div className='tabsMenu-list__content'>
                          {activeGroup.destinations.map((item) => (
                            <div key={item.name} className='tabsMenu-list__item'>
                              <Link href={item.href} onClick={() => setCurrentdd("")}>
                                {item.name}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='tabsMenu-list'>
                        <div className='tabsMenu-list__title'>Quick Actions</div>
                        <div className='tabsMenu-list__content'>
                          <div className='tabsMenu-list__item'>
                            <Link
                              href='/tour-list-1?search=header&sort=-createdAt'
                              onClick={() => setCurrentdd("")}>
                              View latest tours
                            </Link>
                          </div>
                          <div className='tabsMenu-list__item'>
                            <Link
                              href='/tour-list-1?search=header&sort=-rating'
                              onClick={() => setCurrentdd("")}>
                              Explore top rated
                            </Link>
                          </div>
                          <div className='tabsMenu-list__item'>
                            <Link
                              href='/tour-list-1?search=header&sort=price'
                              onClick={() => setCurrentdd("")}>
                              Find budget-friendly options
                            </Link>
                          </div>
                          <div className='tabsMenu-list__item'>
                            <Link
                              href='/tour-list-1'
                              onClick={() => setCurrentdd("")}>
                              Browse all tours
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
