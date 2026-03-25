"use client";
import { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#EB662B", // Change this color to your desired primary color
    },
    secondary: {
      main: "#f50057", // Change this color to your desired secondary color
    },
  },
});

export default function RangeSlider({
  value = [0, 100000],
  onChangeCommitted,
  min = 0,
  max = 100000,
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setLocalValue(newValue);
  };

  return (
    <>
      <div className="js-price-rangeSlider" style={{ padding: "20px 15px" }}>
        <div className="px-5">
          <ThemeProvider theme={theme}>
            <Slider
              getAriaLabel={() => "Minimum distance"}
              value={localValue}
              onChange={handleChange}
              onChangeCommitted={(event, newValue) => {
                if (onChangeCommitted) {
                  onChangeCommitted(newValue);
                }
              }}
              valueLabelDisplay="auto"
              max={max}
              min={min}
              disableSwap
            />
          </ThemeProvider>
        </div>

        <div className="d-flex justify-between mt-20">
          <div className="">
            <span className="">Price:</span>
            <span className="fw-500 js-lower">{localValue[0]}</span>
            <span> - </span>
            <span className="fw-500 js-upper">{localValue[1]}</span>
          </div>
        </div>
      </div>
    </>
  );
}
