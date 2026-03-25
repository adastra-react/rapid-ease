"use client";
import { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ea3c3c",
    },
    secondary: {
      main: "#1f2557",
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
      <div
        className="js-price-rangeSlider"
        style={{
          padding: "18px 14px 10px",
          borderRadius: "20px",
          backgroundColor: "#fafbfd",
          border: "1px solid #eef2f7",
        }}
      >
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
              sx={{
                "& .MuiSlider-rail": {
                  backgroundColor: "#dbe3ee",
                  opacity: 1,
                },
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-thumb": {
                  width: 18,
                  height: 18,
                  backgroundColor: "#fff",
                  border: "4px solid #ea3c3c",
                  boxShadow: "0 8px 18px rgba(234, 60, 60, 0.18)",
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#1f2557",
                  borderRadius: "10px",
                  fontWeight: 600,
                },
              }}
            />
          </ThemeProvider>
        </div>

        <div className="d-flex justify-between mt-20">
          <div
            style={{
              fontSize: "13px",
              color: "#526071",
              fontWeight: 500,
            }}
          >
            <span>Price:</span>
            <span className="fw-600 js-lower" style={{ color: "#1f2557" }}>
              {localValue[0]}
            </span>
            <span> - </span>
            <span className="fw-600 js-upper" style={{ color: "#1f2557" }}>
              {localValue[1]}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
