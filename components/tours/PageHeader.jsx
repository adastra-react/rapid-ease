import Link from "next/link";
import React from "react";

export default function PageHeader({ searchParams = {} }) {
  const location = searchParams?.location;
  const tourType = searchParams?.tourType || searchParams?.tourTypes;
  const title = location
    ? `Explore tours in ${location}, Jamaica`
    : tourType
      ? `${tourType} across Jamaica`
      : "Explore all things to do in Jamaica";
  const subtitle = location
    ? `Popular excursions, private rides, and experiences in ${location}`
    : "THE BEST Jamaican Tours & Excursions";

  return (
    <section className='pageHeader -type-3'>
      <div className='container'>
        <div className='row justify-between'>
          <div className='col-auto'>
            <div className='breadcrumbs'>
              <span className='breadcrumbs__item'>
                <Link href='/'>Home</Link>
              </span>
              <span>{">"}</span>
              <span className='breadcrumbs__item'>
                <Link href='/tour-list-1'>Tours</Link>
              </span>
              <span>{">"}</span>
              <span className='breadcrumbs__item'>
                <span>{location || "Jamaica"}</span>
              </span>
            </div>
          </div>

          <div className='col-auto'>
            <div className='pageHeader__subtitle'>{subtitle}</div>
          </div>
        </div>

        <div className='row pt-30'>
          <div className='col-auto'>
            <h1 className='pageHeader__title'>{title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
