"use client";
import {
  GoogleMap,
  MarkerClusterer,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { MarkerF } from "@react-google-maps/api";
import { useMemo, useState } from "react";

const option = {
  zoomControl: true,
  disableDefaultUI: true,
  styles: [
    // Your existing map styles...
  ],
  scrollwheel: true,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function Map({ tourLocation }) {
  const [getLocation, setLocation] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBatF2YA6-PhY8JsrC_Rx1L_EngUQF5HdI",
  });

  // Use the tourLocation prop if provided, otherwise use a default center
  const center = useMemo(
    () =>
      tourLocation
        ? { lat: tourLocation.lat, lng: tourLocation.lng }
        : { lat: 27.411201277163975, lng: -96.12394824867293 },
    [tourLocation]
  );

  // Use the zoom from tourLocation or default to 4
  const zoom = tourLocation?.zoom || 4;

  // Handler for marker click
  const locationHandler = (location) => {
    setLocation(location);
  };

  // Close handler for info window
  const closeCardHandler = () => {
    setLocation(null);
  };

  return (
    <>
      {!isLoaded ? (
        <p>Loading...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={option}>
          {/* Display marker for the tour location */}
          {tourLocation && (
            <MarkerF
              position={{
                lat: tourLocation.lat,
                lng: tourLocation.lng,
              }}
              onClick={() =>
                locationHandler({
                  lat: tourLocation.lat,
                  lng: tourLocation.lng,
                  title: "Tour Location",
                })
              }
            />
          )}

          {getLocation !== null && (
            <InfoWindow
              position={{
                lat: getLocation.lat,
                lng: getLocation.lng,
              }}
              onCloseClick={closeCardHandler}>
              <div className='p-2'>
                <h3 className='text-base font-medium'>
                  {getLocation.title || "Tour Location"}
                </h3>
                <p className='text-sm'>
                  Location coordinates: {getLocation.lat}, {getLocation.lng}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </>
  );
}
