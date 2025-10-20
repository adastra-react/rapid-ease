import React from "react";

export default function Information() {
  return (
    <section className='layout-pt-lg'>
      <div className='container'>
        <div className='row y-gap-20 justify-between'>
          <div className='col-lg-6'>
            <h2 className='text-30 fw-700'>
              Welcome to RapidEase Tours – your laid-back team of local guides
              making Jamaica easy to explore, one ride at a time.
            </h2>
          </div>

          <div className='col-lg-5'>
            <p>
              We're just a chill group of guys who love showing visitors the
              real Jamaica. Whether you need a reliable airport pickup, a smooth
              drop-off, or want to explore our beautiful island on an
              unforgettable excursion, we've got you covered.
              <br />
              <br />
              No stress, no hassle – just good vibes and great service. From
              Dunn's River Falls to Rick's Café, from Montego Bay to Kingston,
              we know the island like the back of our hands. Let us take care of
              the driving while you sit back, relax, and soak in the Jamaican
              sunshine.
              <br />
              <br />
              At RapidEase Tours, we're not just about getting you from point A
              to point B – we're about making your Jamaican experience smooth,
              safe, and memorable. Come vibe with us!
            </p>

            <button className='button -md -dark-1 bg-accent-1 text-white mt-30'>
              Book Your Adventure
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
