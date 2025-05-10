"use client";

import { useState, useEffect, useRef } from "react";

const buttonData = [
  "Kingston",
  "St. Andrew",
  "Portland",
  "St. Thomas",
  "St. Mary",
  "St. Ann",
  "Trelawny",
  "St. James",
  "Hanover",
  "Westmoreland",
  "Clarendon",
  "Manchester",
  "St. Catherine",
  "St. Elizabeth",
];

const tabContent = [
  {
    heading: "Kingston",
    tours: [
      [
        { id: 1, name: "Bob Marley Museum", href: "#" },
        { id: 2, name: "Devon House", href: "#" },
        { id: 3, name: "Emancipation Park", href: "#" },
        { id: 4, name: "National Gallery of Jamaica", href: "#" },
        { id: 5, name: "Port Royal", href: "#" },
      ],
    ],
  },
  {
    heading: "St. Andrew",
    tours: [
      [
        { id: 1, name: "Blue Mountains & Coffee Tour", href: "#" },
        { id: 2, name: "Hope Botanical Gardens", href: "#" },
        { id: 3, name: "Strawberry Hill Hotel", href: "#" },
        { id: 4, name: "Craighton Estate Great House Tour", href: "#" },
      ],
    ],
  },
  {
    heading: "Portland",
    tours: [
      [
        { id: 1, name: "Reach Falls", href: "#" },
        { id: 2, name: "Blue Lagoon", href: "#" },
        { id: 3, name: "Frenchman's Cove", href: "#" },
        { id: 4, name: "Rafting on the Rio Grande", href: "#" },
        { id: 5, name: "Boston Bay", href: "#" },
      ],
    ],
  },
  {
    heading: "St. Thomas",
    tours: [
      [
        { id: 1, name: "Bath Fountain & Botanical Gardens", href: "#" },
        { id: 2, name: "Reggae Falls", href: "#" },
        { id: 3, name: "Lyssons Beach", href: "#" },
        { id: 4, name: "Morant Bay Courthouse", href: "#" },
      ],
    ],
  },
  {
    heading: "St. Mary",
    tours: [
      [
        { id: 1, name: "James Bond Beach", href: "#" },
        { id: 2, name: "Firefly Estate", href: "#" },
        { id: 3, name: "Galina Point for snorkeling", href: "#" },
        { id: 4, name: "Brimmer Hall Estate Tour", href: "#" },
      ],
    ],
  },
  {
    heading: "St. Ann",
    tours: [
      [
        { id: 1, name: "Dunn's River Falls", href: "#" },
        { id: 2, name: "Mystic Mountain", href: "#" },
        { id: 3, name: "Dolphin Cove", href: "#" },
        { id: 4, name: "Green Grotto Caves", href: "#" },
        { id: 5, name: "Seville Heritage Park", href: "#" },
      ],
    ],
  },
  {
    heading: "Trelawny",
    tours: [
      [
        { id: 1, name: "Martha Brae River Rafting", href: "#" },
        { id: 2, name: "Glistening Waters", href: "#" },
        { id: 3, name: "Falmouth Heritage Walk", href: "#" },
        { id: 4, name: "Hampden Estate Rum Tour", href: "#" },
      ],
    ],
  },
  {
    heading: "St. James",
    tours: [
      [
        { id: 1, name: "Doctor's Cave Beach", href: "#" },
        { id: 2, name: "Rose Hall Great House", href: "#" },
        { id: 3, name: "Montego Bay Hip Strip", href: "#" },
        { id: 4, name: "Ahhh…Ras Natango Gallery and Garden", href: "#" },
        { id: 5, name: "Pier 1", href: "#" },
        { id: 6, name: "27/27 Weed Lounge", href: "#" },
      ],
    ],
  },
  {
    heading: "Hanover",
    tours: [
      [
        { id: 1, name: "Lucea Clock Tower", href: "#" },
        { id: 2, name: "Tryall Club", href: "#" },
        { id: 3, name: "Dolphin Head Mountains hiking", href: "#" },
        { id: 4, name: "Puerto Seco Beach", href: "#" },
      ],
    ],
  },
  {
    heading: "Westmoreland",
    tours: [
      [
        { id: 1, name: "Negril Seven Mile Beach", href: "#" },
        { id: 2, name: "Rick's Café", href: "#" },
        { id: 3, name: "Blue Hole Mineral Spring", href: "#" },
        { id: 4, name: "Booby Cay Island tour", href: "#" },
      ],
    ],
  },
  {
    heading: "Clarendon",
    tours: [
      [
        { id: 1, name: "Milk River Bath", href: "#" },
        { id: 2, name: "Halse Hall Great House", href: "#" },
        { id: 3, name: "Vere Bird Sanctuary", href: "#" },
        { id: 4, name: "Clarendon Park Market", href: "#" },
      ],
    ],
  },
  {
    heading: "Manchester",
    tours: [
      [
        { id: 1, name: "Mandeville Town Tour", href: "#" },
        { id: 2, name: "Marshall's Pen", href: "#" },
        { id: 3, name: "Bloomfield Great House", href: "#" },
        { id: 4, name: "Gourie Cave exploration", href: "#" },
      ],
    ],
  },
  {
    heading: "St. Catherine",
    tours: [
      [
        { id: 1, name: "Hellshire Beach", href: "#" },
        { id: 2, name: "Spanish Town historic sites", href: "#" },
        { id: 3, name: "Caymanas Golf Club", href: "#" },
        { id: 4, name: "Emancipation Square", href: "#" },
      ],
    ],
  },
  {
    heading: "St. Elizabeth",
    tours: [
      [
        { id: 1, name: "Appleton Estate Rum Tour", href: "#" },
        { id: 2, name: "YS Falls", href: "#" },
        { id: 3, name: "Black River Safari", href: "#" },
        { id: 4, name: "Lover's Leap viewpoint", href: "#" },
      ],
    ],
  },
];

export default function Destinations() {
  const [currentdestinationTab, setCurrentdestinationTab] =
    useState("Kingston");
  const [currentdd, setCurrentdd] = useState("");
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
          setCurrentdd((pre) => (pre == "destination" ? "" : "destination"))
        }>
        Parishes
        <i className='icon-chevron-down text-18'></i>
      </div>

      <div
        className={`headerDropdown__content ${
          currentdd == "destination" ? "is-active" : ""
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
                        .tours.map((elm2, i2) => (
                          <div key={i2} className='tabsMenu-list'>
                            <div className='tabsMenu-list__title'>
                              {
                                tabContent.filter(
                                  (elm) => elm.heading == currentdestinationTab
                                )[0].heading
                              }{" "}
                              Travel Guide
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
