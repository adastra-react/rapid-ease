"use client";

import React, { useState } from "react";
import ImageLightBox from "./ImageLightBox";
import Image from "next/image";

export default function Gallery1({ tour }) {
  const [activeLightBox, setActiveLightBox] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Start at 0 instead of 1

  // Fallback images if tour or tour.images is not available
  const fallbackImages = [
    {
      id: 1,
      image: `/img/tourSingle/1/1.png`,
    },
    {
      id: 2,
      image: `/img/tourSingle/1/2.png`,
    },
    {
      id: 3,
      image: `/img/tourSingle/1/3.png`,
    },
    {
      id: 4,
      image: `/img/tourSingle/1/4.png`,
    },
  ];

  // Get images from tour data or use fallback
  const tourImages = tour?.images || [];

  // Convert tour images to lightbox format
  const lightboxImages =
    tourImages.length > 0
      ? tourImages.map((img, index) => ({
          id: index + 1,
          image: img.url,
        }))
      : fallbackImages;

  // Handle image duplication for grid layout
  const getGridImages = () => {
    if (tourImages.length === 0) return null;

    if (tourImages.length === 1) {
      // Duplicate the single image to fill all 4 slots
      return [tourImages[0], tourImages[0], tourImages[0], tourImages[0]];
    } else if (tourImages.length < 4) {
      // Fill remaining slots by repeating images
      const gridImages = [...tourImages];
      while (gridImages.length < 4) {
        gridImages.push(
          ...tourImages.slice(
            0,
            Math.min(tourImages.length, 4 - gridImages.length)
          )
        );
      }
      return gridImages.slice(0, 4);
    } else {
      // Use first 4 images
      return tourImages.slice(0, 4);
    }
  };

  const gridImages = getGridImages();

  return (
    <>
      <div className='tourSingleGrid -type-1 mt-30'>
        <div className='tourSingleGrid__grid mobile-css-slider-2'>
          {gridImages ? (
            <>
              {/* Main large image */}
              <Image
                width={1155}
                height={765}
                src={gridImages[0].url}
                alt={gridImages[0].alt || tour?.title || "Tour image"}
              />

              {/* Second image */}
              <Image
                width={765}
                height={375}
                src={gridImages[1].url}
                alt={gridImages[1].alt || tour?.title || "Tour image"}
              />

              {/* Third image */}
              <Image
                width={375}
                height={375}
                src={gridImages[2].url}
                alt={gridImages[2].alt || tour?.title || "Tour image"}
              />

              {/* Fourth image */}
              <Image
                width={375}
                height={375}
                src={gridImages[3].url}
                alt={gridImages[3].alt || tour?.title || "Tour image"}
              />
            </>
          ) : (
            /* Fallback to default images if no tour images */
            <>
              <Image
                width={1155}
                height={765}
                src='/img/tourSingle/1/1.png'
                alt='Tour image'
              />
              <Image
                width={765}
                height={375}
                src='/img/tourSingle/1/2.png'
                alt='Tour image'
              />
              <Image
                width={375}
                height={375}
                src='/img/tourSingle/1/3.png'
                alt='Tour image'
              />
              <Image
                width={375}
                height={375}
                src='/img/tourSingle/1/4.png'
                alt='Tour image'
              />
            </>
          )}
        </div>

        <div className='tourSingleGrid__button'>
          <div
            style={{ cursor: "pointer" }}
            className='js-gallery'
            data-gallery='gallery1'>
            <span
              onClick={() => {
                setCurrentSlideIndex(0); // Reset to first image
                setActiveLightBox(true);
              }}
              className='button -accent-1 py-10 px-20 rounded-200 bg-dark-1 lh-16 text-white'>
              See all photos{" "}
              {tourImages.length > 0 ? `(${tourImages.length})` : ""}
            </span>
          </div>

          {/* Dynamic gallery links for additional images */}
          {lightboxImages.slice(1).map((img, index) => (
            <a
              key={index}
              href={img.image}
              className='js-gallery'
              data-gallery='gallery1'
              style={{ display: "none" }}></a>
          ))}
        </div>
      </div>

      <ImageLightBox
        images={lightboxImages}
        activeLightBox={activeLightBox}
        setActiveLightBox={setActiveLightBox}
        currentSlideIndex={currentSlideIndex}
        setCurrentSlideIndex={setCurrentSlideIndex}
      />
    </>
  );
}
