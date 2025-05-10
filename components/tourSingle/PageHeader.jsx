import React from "react";

export default function PageHeader() {
  return (
    <div className='container'>
      <div className='row justify-between py-30 mt-80'>
        <div className='col-auto'>
          <div className='text-14'>
            Home {">"} Tours {">"} Jamaica
          </div>
        </div>

        <div className='col-auto'>
          <div className='text-14'>THE 10 BEST Jamaican Tours & Excursions</div>
        </div>
      </div>
    </div>
  );
}
