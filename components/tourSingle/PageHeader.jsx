import Link from "next/link";
import React from "react";

export default function PageHeader({ tour }) {
  return (
    <div className='container'>
      <div className='row justify-between py-30 mt-80'>
        <div className='col-auto'>
          <div className='text-14'>
            <Link href='/'>Home</Link> {">"} <Link href='/tour-list-1'>Tours</Link>{" "}
            {">"} {tour?.location || "Jamaica"}
          </div>
        </div>

        <div className='col-auto'>
          <div className='text-14'>
            {tour?.location ? `Explore ${tour.location}` : "Jamaica tour details"}
          </div>
        </div>
      </div>
    </div>
  );
}
