"use client";

import { useState, useEffect, useRef } from "react";

const buttonData = [
  "Beach & Water Activities",
  "Culture & Heritage",
  "Adventure & Nature",
  "Food & Nightlife",
  "Water Sports",
  "Boat & Cruise Tours",
  "Land Tours",
  "Relaxation & Wellness",
];

const tabContent = [
  {
    heading: "Beach & Water Activities",
    items: [
      [
        { id: 1, name: "Doctor's Cave Beach", href: "#" },
        { id: 2, name: "Seven Mile Beach", href: "#" },
        { id: 3, name: "Dunn's River Falls", href: "#" },
        { id: 4, name: "Blue Lagoon Tours", href: "#" },
        { id: 5, name: "Luminous Lagoon", href: "#" },
        { id: 6, name: "Beach Hopping Tours", href: "#" },
        { id: 7, name: "Snorkeling Adventures", href: "#" },
        { id: 8, name: "Swimming with Dolphins", href: "#" },
      ],
      [
        { id: 9, name: "Glass Bottom Boat Tours", href: "#" },
        { id: 10, name: "Sunset Beach Tours", href: "#" },
        { id: 11, name: "Private Beach Excursions", href: "#" },
        { id: 12, name: "Cliff Jumping Tours", href: "#" },
      ],
    ],
  },
  {
    heading: "Culture & Heritage",
    items: [
      [
        { id: 1, name: "Bob Marley Museum", href: "#" },
        { id: 2, name: "Rose Hall Great House", href: "#" },
        { id: 3, name: "Devon House Tours", href: "#" },
        { id: 4, name: "Reggae History Tours", href: "#" },
        { id: 5, name: "Port Royal Historical Tour", href: "#" },
        { id: 6, name: "Maroon Village Experience", href: "#" },
        { id: 7, name: "Rastafarian Culture Tours", href: "#" },
        { id: 8, name: "Trench Town Tours", href: "#" },
      ],
      [
        { id: 9, name: "Jamaican Craft Markets", href: "#" },
        { id: 10, name: "National Gallery Tours", href: "#" },
        { id: 11, name: "Appleton Estate Rum Tour", href: "#" },
        { id: 12, name: "Coffee Plantation Tours", href: "#" },
      ],
    ],
  },
  {
    heading: "Adventure & Nature",
    items: [
      [
        { id: 1, name: "Blue Mountain Hiking", href: "#" },
        { id: 2, name: "ATV Tours", href: "#" },
        { id: 3, name: "Zipline Adventures", href: "#" },
        { id: 4, name: "Horseback Riding", href: "#" },
        { id: 5, name: "River Rafting Tours", href: "#" },
        { id: 6, name: "YS Falls Tours", href: "#" },
        { id: 7, name: "Reach Falls Exploration", href: "#" },
        { id: 8, name: "Black River Safari", href: "#" },
      ],
      [
        { id: 9, name: "Cockpit Country Tours", href: "#" },
        { id: 10, name: "Green Grotto Caves", href: "#" },
        { id: 11, name: "Konoko Falls & Park", reach: "#" },
        { id: 12, name: "Jungle Canopy Tours", href: "#" },
      ],
    ],
  },
  {
    heading: "Food & Nightlife",
    items: [
      [
        { id: 1, name: "Jerk Chicken Tours", href: "#" },
        { id: 2, name: "Street Food Tours", href: "#" },
        { id: 3, name: "Jamaican Cooking Classes", href: "#" },
        { id: 4, name: "Scotchies Restaurant Tour", href: "#" },
        { id: 5, name: "Ackee & Saltfish Experience", href: "#" },
        { id: 6, name: "Hip Strip Nightlife", href: "#" },
        { id: 7, name: "Reggae Beach Party", href: "#" },
        { id: 8, name: "Margaritaville Tours", href: "#" },
      ],
      [
        { id: 9, name: "Pub Crawl Montego Bay", href: "#" },
        { id: 10, name: "Rum Tasting Tours", href: "#" },
        { id: 11, name: "Red Stripe Brewery Tour", href: "#" },
        { id: 12, name: "Pier One Sunset Dining", href: "#" },
      ],
    ],
  },
  {
    heading: "Water Sports",
    items: [
      [
        { id: 1, name: "Scuba Diving", href: "#" },
        { id: 2, name: "Jet Skiing", href: "#" },
        { id: 3, name: "Parasailing", href: "#" },
        { id: 4, name: "Kayaking Tours", href: "#" },
        { id: 5, name: "Paddleboarding", href: "#" },
        { id: 6, name: "Deep Sea Fishing", href: "#" },
        { id: 7, name: "Windsurfing", href: "#" },
        { id: 8, name: "Kite Surfing", href: "#" },
      ],
      [
        { id: 9, name: "Snorkel & Sail Tours", href: "#" },
        { id: 10, name: "Banana Boat Rides", href: "#" },
        { id: 11, name: "Tube Rides", href: "#" },
        { id: 12, name: "Flyboarding", href: "#" },
      ],
    ],
  },
  {
    heading: "Boat & Cruise Tours",
    items: [
      [
        { id: 1, name: "Catamaran Cruises", href: "#" },
        { id: 2, name: "Sunset Cruises", href: "#" },
        { id: 3, name: "Party Boat Tours", href: "#" },
        { id: 4, name: "Negril Cliffs Cruise", href: "#" },
        { id: 5, name: "Private Yacht Charters", href: "#" },
        { id: 6, name: "Snorkeling Cruises", href: "#" },
        { id: 7, name: "Booze Cruise", href: "#" },
        { id: 8, name: "Glass Bottom Boat", href: "#" },
      ],
      [
        { id: 9, name: "Island Hopping Tours", href: "#" },
        { id: 10, name: "Fishing Charters", href: "#" },
        { id: 11, name: "Romantic Dinner Cruise", href: "#" },
        { id: 12, name: "Pelican Bar Trip", href: "#" },
      ],
    ],
  },
  {
    heading: "Land Tours",
    items: [
      [
        { id: 1, name: "Montego Bay City Tour", href: "#" },
        { id: 2, name: "Negril Day Trip", href: "#" },
        { id: 3, name: "Ocho Rios Excursion", href: "#" },
        { id: 4, name: "Kingston City Tour", href: "#" },
        { id: 5, name: "Safari Village Tour", href: "#" },
        { id: 6, name: "Plantations Tours", href: "#" },
        { id: 7, name: "Beach to Beach Tour", href: "#" },
        { id: 8, name: "Island Highlights Tour", href: "#" },
      ],
      [
        { id: 9, name: "Countryside Drive", href: "#" },
        { id: 10, name: "Mountain Village Tour", href: "#" },
        { id: 11, name: "Shopping Tours", href: "#" },
        { id: 12, name: "Custom Private Tours", href: "#" },
      ],
    ],
  },
  {
    heading: "Relaxation & Wellness",
    items: [
      [
        { id: 1, name: "Beach Spa Treatments", href: "#" },
        { id: 2, name: "Hot Stone Massage", href: "#" },
        { id: 3, name: "Couples Massage", href: "#" },
        { id: 4, name: "Beach Yoga Sessions", href: "#" },
        { id: 5, name: "Wellness Retreats", href: "#" },
        { id: 6, name: "Sunset Meditation", href: "#" },
        { id: 7, name: "Mineral Bath Tours", href: "#" },
        { id: 8, name: "Aromatherapy Sessions", href: "#" },
      ],
      [
        { id: 9, name: "Private Cabana Rentals", href: "#" },
        { id: 10, name: "Beach Picnic Setup", href: "#" },
        { id: 11, name: "Garden Tours & Tea", href: "#" },
        { id: 12, name: "Photography Tours", href: "#" },
      ],
    ],
  },
];

export default function Activities() {
  const [currentdd, setCurrentdd] = useState("");
  const [currentdestinationTab, setCurrentdestinationTab] = useState(
    "Beach & Water Activities"
  );
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

  return (
    <div
      ref={dropDownContainer}
      className='headerDropdown lg:d-none js-form-dd'>
      <div
        className='headerDropdown__button '
        onClick={() =>
          setCurrentdd((pre) => (pre == "activities" ? "" : "activities"))
        }>
        Activities
        <i className='icon-chevron-down text-18'></i>
      </div>

      <div
        className={`headerDropdown__content ${
          currentdd == "activities" ? "is-active" : ""
        } `}>
        <div className='tabsMenu'>
          <div className='tabsMenu__container'>
            <div className='tabs js-tabs'>
              <div className='tabsMenu__tabs'>
                <div className='tabs__controls js-tabs-controls'>
                  {buttonData.map((elm, i) => (
                    <button
                      onClick={() => setCurrentdestinationTab(elm)}
                      key={i}
                      className={`tabs__button js-tabs-button ${
                        currentdestinationTab == elm ? "is-tab-el-active" : ""
                      } `}
                      data-tab-target='.-tab-item-1'>
                      {elm}
                    </button>
                  ))}
                </div>
              </div>

              <div className='tabsMenu__content'>
                <div className='tabs__content js-tabs-content'>
                  <div className='tabs__pane -tab-item-1 is-tab-el-active'>
                    <div className='tabsMenu__lists'>
                      {tabContent
                        .filter(
                          (elm) => elm.heading == currentdestinationTab
                        )[0]
                        ?.items.map((elm2, i2) => (
                          <div key={i2} className='tabsMenu-list'>
                            <div className='tabsMenu-list__title'>
                              {
                                tabContent.filter(
                                  (elm) => elm.heading == currentdestinationTab
                                )[0].heading
                              }
                            </div>
                            <div className='tabsMenu-list__content'>
                              {elm2.map((elm3, i3) => (
                                <div key={i3} className='tabsMenu-list__item'>
                                  <a href={elm3.href}>{elm3.name}</a>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
