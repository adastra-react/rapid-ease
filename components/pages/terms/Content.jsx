"use client";

import React, { useEffect, useState } from "react";

const tabs = [
  "Cancellation Policy",
  "Important Notice",
  "Limitation of Damages",
  "Venue & Choice of Law",
  "Other Terms",
];

export default function Content() {
  const [currentTab, setCurrentTab] = useState("Cancellation Policy");

  useEffect(() => {
    const termsContainer = document.getElementById("termsContainer");
    if (termsContainer) {
      termsContainer.style.opacity = 0;
      setTimeout(() => {
        termsContainer.style.opacity = 1;
      }, 300);
    }
  }, [currentTab]);

  const renderContent = () => {
    switch (currentTab) {
      case "Cancellation Policy":
        return (
          <>
            <h2 className='text-20 fw-500'>
              Cancellation Policy - Standard Tours
            </h2>
            <p className='mt-10'>
              Cancellation charges depend on when Rapid Ease Tours receives
              notice of the cancellation. We require at least 4 days
              cancellation notice prior to your scheduled tour date; otherwise
              cancellation fee will be applied against your total amount as
              outlined below:
            </p>

            <h3 className='text-18 fw-500 mt-30'>Standard Tours</h3>
            <ul className='mt-10 ml-20'>
              <li>• 3 days prior to tour date: 25% cancellation fee</li>
              <li>• 2 days prior to tour date: 50% cancellation fee</li>
              <li>• 1 day prior to tour date: No Refund</li>
            </ul>

            <h3 className='text-18 fw-500 mt-30'>Customized Tours/Charters</h3>
            <p className='mt-10'>
              We require at least 60 days cancellation notice prior to your
              scheduled tour date:
            </p>
            <ul className='mt-10 ml-20'>
              <li>• 59 to 44 days prior to tour date: 50% cancellation fee</li>
              <li>• 45 to 30 days prior to tour date: 75% cancellation fee</li>
              <li>• Less than 30 days prior to tour date: No refund</li>
            </ul>

            <p className='mt-20 fw-500'>
              All cancellations or changes are subject to applicable
              restrictions. Rapid Ease Tours will apply any payments made toward
              the purchase price against any cancellation charges and will
              refund any balance remaining after the payment of any charges. In
              order to receive a refund, if applicable, client must request and
              receive a cancellation confirmation number.
            </p>

            <p className='mt-20 text-red-1 fw-500'>
              NO REFUNDS OR ADJUSTMENTS WILL BE MADE FOR ANY PORTION OF TOUR OR
              ATTENDANT SERVICES NOT UTILIZED.
            </p>
          </>
        );

      case "Important Notice":
        return (
          <>
            <h2 className='text-20 fw-500'>
              Important Notice - Standard Tours
            </h2>
            <p className='mt-10 fw-500'>
              IMPORTANT: THESE TERMS AND CONDITIONS APPLY IN RELATION TO
              EXCURSIONS, TOUR OPERATORS, AND OTHER SERVICES FOR YOU AND ANYONE
              TRAVELING WITH OR THROUGH YOU (COLLECTIVELY AND INDIVIDUALLY
              "GUEST") AND MAY AFFECT YOUR LEGAL RIGHTS. PLEASE READ THESE TERMS
              AND CONDITIONS CAREFULLY.
            </p>

            <p className='mt-20'>
              YOUR ACCEPTANCE OF TICKETS OR VOUCHERS AND PURCHASE FROM RAPID
              EASE TOURS CONSTITUTES ACCEPTANCE OF THESE TERMS AND CONDITIONS
              (THE "CONTRACT").
            </p>

            <h3 className='text-18 fw-500 mt-30'>
              Physical Demands & Safety Notice
            </h3>
            <p className='mt-10'>
              Some tours are physically demanding and are not suitable for the
              infirm, individuals with heart conditions, women who are pregnant,
              or the physically challenged. Tour times and dates may vary based
              on volume or availability.
            </p>

            <p className='mt-20'>
              To the exclusion of tours identified at www.rapidease876.com as
              being owned by Rapid Ease Tours, there exists no relationship of
              master and servant or of agency between the Operators of tours and
              Rapid Ease Tours. The Operators of tours are solely responsible
              for their acts and omissions and Rapid Ease Tours assumes no
              responsibility for such acts and omissions.
            </p>

            <p className='mt-20 text-red-1 fw-500'>
              Rapid Ease Tours shall not assume any responsibility for injury,
              loss or damage to any person that voluntarily participates in
              cliff diving at any location, including but not limited to Dunn's
              River Falls or Rick's Café, and/or to any person who voluntarily
              stops as part of and/or during transport to/from a tour at an
              unintended destination.
            </p>

            <p className='mt-20'>
              Rapid Ease Tours shall not assume any responsibility for the loss
              or damage to money, jewelry, clothing or other valuables that have
              not been tendered to Management for safe keeping.
            </p>

            <p className='mt-20 fw-500'>
              Please note, for your safety, guests will not be allowed to
              participate in helicopter tours and/or transfers if they have
              undertaken any diving exercise within 24 hours prior to departure
              of said tour/transfer.
            </p>
          </>
        );

      case "Limitation of Damages":
        return (
          <>
            <h2 className='text-20 fw-500'>Limitation of Damages</h2>
            <p className='mt-10 fw-500'>
              Guest HEREBY ACKNOWLEDGES AND AGREES that Rapid Ease Tours, their
              parent corporation, affiliates, subsidiaries, insurers, directors,
              officers, employees, successors, assigns, agents or
              representatives, SHALL NOT BE LIABLE to Guest for liabilities,
              claims, actions, damages, cost or expense in any circumstances,
              for:
            </p>

            <ul className='mt-20 ml-20'>
              <li className='mb-15'>
                <strong>(A)</strong> ANY PERSONAL INJURIES OR PROPERTY DAMAGE
                ARISING OUT OF OR CAUSED BY ANY ACT OR OMISSION ON THE PART OF
                ANY Guest(s) and/or Operators of tours, excluding tours
                identified as being owned by Rapid Ease Tours
              </li>
              <li className='mb-15'>
                <strong>(B)</strong> EMOTIONAL DISTRESS, MENTAL SUFFERING, OR
                PSYCHOLOGICAL INJURY OF ANY KIND
              </li>
              <li className='mb-15'>
                <strong>(C)</strong> ANY CONSEQUENTIAL, INCIDENTAL, PUNITIVE OR
                EXEMPLARY DAMAGES
              </li>
            </ul>

            <p className='mt-20'>
              This specifically includes but is not limited to liabilities,
              claims, actions, damages, cost or expense ARISING OUT OF OR CAUSED
              BY food or drink consumed at third party facilities belonging to
              third party Operators of tours.
            </p>
          </>
        );

      case "Venue & Choice of Law":
        return (
          <>
            <h2 className='text-20 fw-500'>Venue and Choice of Law</h2>
            <p className='mt-10 fw-500'>
              ALL CLAIMS WHATSOEVER AGAINST RAPID EASE TOURS, ITS AFFILIATES,
              PARENT COMPANY, SUBSIDIARIES, DIRECTORS, OFFICERS, EMPLOYEES,
              AGENTS, CONTRACTORS OR REPRESENTATIVES ARISING FROM, IN CONNECTION
              WITH, OR INCIDENTAL TO THE CONTRACT, INCLUDING, BUT NOT LIMITED
              TO, ANY CLAIMS RELATING TO THE FORMATION, INTERPRETATION,
              CONSTRUCTION, WAIVER, MODIFICATION, PERFORMANCE, DISCHARGE, OR
              BREACH OF THE CONTRACT, OR THE EXISTENCE, EXTENT, OR BREACH OF ANY
              FIDUCIARY DUTY, OR ANY DUTY IN TORT OR PURSUANT TO ANY STATUTE,
              SHALL BE LITIGATED SOLELY AND EXCLUSIVELY IN THE COUNTRY IN WHICH
              THE EXCURSION AND/OR TOUR IS OPERATED, AND SHALL BE GOVERNED BY
              THE LAWS OF JAMAICA WITHOUT REGARD TO THE CHOICE OF LAW PRINCIPLES
              THEREOF.
            </p>

            <h3 className='text-18 fw-500 mt-30'>Use of Guest's Likeness</h3>
            <p className='mt-10'>
              The undersigned Guest(s) irrevocably consents to and authorizes
              the use and reproduction by Rapid Ease Tours, or anyone authorized
              by Rapid Ease Tours, of any and all photographic, video and other
              visual portrayal(s) of the undersigned Guest(s), their child or
              ward, for any purpose whatsoever, including but not limited to use
              in magazines, brochures, flyers, television, internet, and
              websites displays without further reference or compensation. All
              rights, title and interest therein (including all worldwide
              copyrights therein) shall be the sole property of Rapid Ease
              Tours.
            </p>

            <h3 className='text-18 fw-500 mt-30'>Compliance with Local Law</h3>
            <p className='mt-10'>
              Guest is responsible for knowing, obeying and complying with the
              laws and regulations of their destination, and Rapid Ease Tours,
              nor any Tour Supplier, has any duty to inform or warn Guest about
              the destination's laws and/or regulations.
            </p>
          </>
        );

      case "Other Terms":
        return (
          <>
            <h2 className='text-20 fw-500'>Tour Necessities</h2>
            <ul className='mt-10 ml-20'>
              <li>• Closed Toe Aqua Shoes or Sneakers</li>
              <li>• Cash</li>
              <li>• Swimwear</li>
              <li>• Camera</li>
              <li>• Towel</li>
              <li>• Sunblock</li>
              <li>• Headwear</li>
              <li>• Bottle Water</li>
              <li>• Driver's License (where applicable)</li>
            </ul>

            <p className='mt-20'>
              <strong>Note:</strong> Prices include tax where applicable.
            </p>

            <h3 className='text-18 fw-500 mt-30'>Special Requests</h3>
            <p className='mt-10'>
              Rapid Ease Tours cannot guarantee that it will satisfy special
              requests and we are not responsible if such requests are not met.
            </p>

            <h3 className='text-18 fw-500 mt-30'>Persons with Disabilities</h3>
            <p className='mt-10'>
              Rapid Ease Tours cannot guarantee that transfer vehicles or tour
              sites are wheelchair accessible. However, if informed, we will
              endeavor to make the necessary arrangements. This may however come
              at an additional cost.
            </p>

            <h3 className='text-18 fw-500 mt-30'>Guest Acknowledgment</h3>
            <p className='mt-10'>
              The undersigned guest hereby confirms that he/she has read,
              understood and accepted the clauses above. FURTHER, the
              undersigned acknowledges, understands, and agrees that said
              clauses apply to and cover any children (under the age of 18)
              accompanying such guest for whom such guest is responsible as the
              parent or legal guardian of the child.
            </p>

            <p className='mt-20'>
              In the event the guest is traveling with minor children (under the
              age of 18), the signature of the guest who is the parent or legal
              guardian, is also made on behalf of the child or children. The
              undersigned additionally warrants that he/she has authority to
              sign and accept said clauses on behalf of any remaining adult
              members listed in his/her traveling party.
            </p>

            <p className='mt-20 fw-500'>
              Where there is an age limit for a Tour, the undersigned and or the
              authorized person signing on their behalf hereby warrants that
              he/she is within the required age group to participate in the
              Tour.
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section className='layout-pt-md layout-pb-lg'>
      <div className='container'>
        <div className='tabs -terms js-tabs'>
          <div className='row y-gap-30'>
            <div className='col-lg-3'>
              <div className='tabs__controls row y-gap-10 js-tabs-controls'>
                {tabs.map((elm, i) => (
                  <div
                    key={i}
                    className='col-12'
                    onClick={() => setCurrentTab(elm)}>
                    <button
                      className={`tabs__button relative pl-20 js-tabs-button ${
                        elm === currentTab ? "is-tab-el-active" : ""
                      }`}
                      data-tab-target='.-tab-item-1'>
                      {elm}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='col-lg-9'>
              <div className='tabs__content js-tabs-content'>
                <div
                  id='termsContainer'
                  style={{ transition: "0.3s" }}
                  className='tabs__pane -tab-item-1 is-tab-el-active'>
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
